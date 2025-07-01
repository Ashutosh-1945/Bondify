import { config } from "dotenv";
import cors from "cors";
import express, { json } from "express";
import pg from "pg"; 
import { hash, compare } from "bcrypt";
import cookieParser from "cookie-parser";
const { Pool } = pg;
import jwt from 'jsonwebtoken';
import multer from 'multer';
import { createClient } from "@supabase/supabase-js";
import { decode } from "base64-arraybuffer";
import FormData from 'form-data';
import axios from "axios";



config();
const supabaseUrl = process.env.SUPABASE_PROJECT_URL 
const supabaseKey = process.env.SUPABASE_ANON_KEY 
console.log(supabaseUrl)
const supabase = createClient(supabaseUrl, supabaseKey)

const app = express();
const port = process.env.PORT;
app.use(json());
app.use(cookieParser());

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true, // Allow cookies if needed
}));

//const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});
pool.connect()
  .then(client => {
    console.log('Connected to PostgreSQL');
    client.release();
  })
  .catch(err => console.error('Connection error', err.stack));

const generateAccessToken = (user) => {
  // console.log("Hit")
  return jwt.sign({ userId: user.id, email: user.email }, process.env.JWT_SECRET, {
    expiresIn: "120m", 
  });
};

const generateRefreshToken = (user) => {
  return jwt.sign({ userId: user.id, email: user.email }, process.env.REFRESH_SECRET, {
    expiresIn: "7d", 
  });
};


app.get('/', (req, res) => {
  res.send('Hello, World!');
});

app.get('/test', async (req, res) => {
  console.log("")
  try{
    const result = await pool.query("SELECT * FROM users");
    res.json(result.rows);
  }catch(err){
    console.log(err.message);
    res.status(500).send("Server Error");
  }

});

app.post('/register', async (req, res) => {
  const {name, email, password} = req.body;
  const hashedPassword = await hash(password, 10);
  try{
    const emailCheck = await pool.query('SELECT * FROM users WHERE email = $1', [email]);

    if (emailCheck.rows.length > 0) {
      return res.status(400).json({ error: 'Email already exists. Please login instead.' });
    }

    await pool.query('INSERT INTO users (username, email, password) VALUES ($1, $2, $3)',
      [name, email, hashedPassword]
    );

    res.status(201).send({message: "Registerred successfully"})
  }catch(err){
    console.log(err.message);
    res.status(500).send("Server Error")
  }
})

app.post('/login', async (req,res) => {
  const { email, password } = req.body;
  try{
    const userCheck = await pool.query('SELECT * FROM users WHERE email = $1', [email]);


    if (userCheck.rows.length == 0) {
      return res.status(400).json({ error: 'User not found.' });
    }
    const user = userCheck.rows[0];
    console.log(user)
    const isValid = await compare(password, user.password);

    if(!isValid){
      return res.status(400).json({error: "Wrong password"});
    }

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    await pool.query("UPDATE users SET token = $1 WHERE id = $2", [refreshToken, user.id]);

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 15 * 60 * 1000, // 15 mins
    })

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
    console.log(refreshToken)
    res.status(201).send({message: "Loggen in successfully"})
  }catch(err){
    console.log(err.message);
    res.status(500).send("Server Error")
  }
})

app.get("/check", async (req, res) => {
  try {
    const accessToken = req.cookies.accessToken;

    if (!accessToken) {
      return res.status(401).json({ message: "Unauthorized - No token" });
    }

    jwt.verify(accessToken, process.env.JWT_SECRET, async (err, decoded) => {
      if (err) return res.status(401).json({ message: "Token expired or invalid" });

      const userResult = await pool.query("SELECT id, username, email FROM users WHERE id = $1", [
        decoded.userId,
      ]);

      if (userResult.rows.length === 0) return res.status(404).json({ message: "User not found" });

      res.json(userResult.rows[0]);
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});


app.get("/refresh", async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) return res.status(401).json({ message: "Unauthorized - No refresh token" });

    jwt.verify(refreshToken, process.env.REFRESH_SECRET, async (err, decoded) => {
      if (err) return res.status(403).json({ message: "Invalid refresh token" });

      const tokenCheck = await pool.query("SELECT * FROM users WHERE id = $1 AND token = $2", [
        decoded.userId,
        refreshToken,
      ]);

      if (tokenCheck.rows.length === 0) return res.status(403).json({ message: "Refresh token invalid" });

      // 🟢 Generate new access token
      const newAccessToken = jwt.sign({ userId: decoded.userId }, process.env.JWT_SECRET, {
        expiresIn: "15m",
      });

      res.cookie("accessToken", newAccessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 15 * 60 * 1000, // 15 minutes
      });

      res.json({ message: "Token refreshed", user: { id: decoded.userId } });
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

app.get('/events', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM events');
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});  
   


/*use latter 
const authMiddleware = (req, res, next) => {
  const token = req.cookies.accessToken; // Get token from cookie

  if (!token) return res.status(401).json({ message: "Unauthorized" });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: "Token is invalid or expired" });

    req.user = user; // Attach user info to request
    next();
  });
};
*/
const storage = multer.memoryStorage();
// Initialize multer with the storage configuration
const upload = multer({ storage: storage });

app.get('/event/:eventId', async(req,res) => {
  const {eventId}= req.params;
  try{
    const result = await pool.query(
      `SELECT events.*, users.username AS userName 
       FROM events 
       JOIN users ON events.userid = users.id 
       WHERE events.id = $1`,
      [eventId]
    );
    res.json(result.rows[0])
  }catch(err){
    console.log(err);
    res.status(500).json({error: "Failed to get event data"})
  }
})

app.post('/attend/:eventId', async(req,res) => {
  const {eventId}= req.params;
  const {email} = req.body;
  try{
    const user = await pool.query('SELECT id FROM users WHERE email = $1',
      [email]
    );
    const userId = user.rows[0].id
    const result = await pool.query(
      `INSERT INTO participants (event_id, participant_id) VALUES ($1, $2) RETURNING *`,
      [eventId, userId]
    );
    res.json({success: true})
  }catch(err){
    console.log(err)
    res.status(500).json({error: "Failed to get event data"})
  }
})

app.get('/check-requested/:id', async (req, res) => {
  const { id } = req.params;
  const { email } = req.query;
  console.log("Check request")

  try{
    const user = await pool.query('SELECT id FROM users WHERE email = $1',
      [email]
    );
    const userId = user.rows[0].id

    const result = await pool.query(
      'SELECT * FROM requests WHERE event_id = $1 AND user_id = $2',
      [id, userId]
    );
  
    res.json({ isRequested: result.rows.length > 0 });
  }catch(err){
    console.log(err);
    res.status(500).json({error: "Server error"})
  }

});

app.get('/check-registration/:eventId', async (req, res) => {
  const { eventId } = req.params;
  const { email } = req.query;


  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  try {

    const user = await pool.query('SELECT id FROM users WHERE email = $1',
      [email]
    );
    const userId = user.rows[0].id
    // Check if user is registered for the event
    const checkRegistration = await pool.query(
      `SELECT * FROM participants WHERE event_id = $1 AND participant_id = $2`,
      [eventId, userId]
    );

    if (checkRegistration.rows.length > 0) {
      return res.json({ isRegistered: true });
    }

    res.json({ isRegistered: false });
  } catch (error) {
    console.error('Error checking registration:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/participants/:id', async (req, res) => {
  const { id } = req.params;

  try{
    const result = await pool.query(
      `SELECT participants.id AS participant_id,users.username
       FROM participants
       JOIN users ON participants.participant_id = users.id
       WHERE participants.event_id = $1`,
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(200).json({ message: 'No participants found for this event.' });
    }

    res.status(200).json(result.rows);
  }catch(err){
    console.log(err);
  }
})

const uploadImageToSupabase = async (file) => {
  const { data, error } = await supabase.storage
    .from("images")
    .upload(file.originalname, file.buffer, {
      contentType: "image/png",
    });

  if (error) throw error;

  const { data: image } = supabase.storage
    .from("images")
    .getPublicUrl(data.path);

  return image.publicUrl;
};

app.post('/create_event', upload.fields([{ name: 'titleImage', maxCount: 1 }, { name: 'otherImages' }]), async (req, res) => {
  const {
    title,
    description,
    eventDate,
    fromTime,
    toTime,
    eventType,
    place,
    maxAttendees,
    registration,
    category,
    paymentType,
    cost,
    email
  } = req.body;

  try {
    // Convert to correct time format (HH:MM:SS)
    const formattedFromTime = fromTime.split('T')[1]?.split('.')[0] || null;
    const formattedToTime = toTime.split('T')[1]?.split('.')[0] || null;
    const finalCost = paymentType === 'free' ? null : (cost ? parseFloat(cost) : null);

    // Get userId using email
    const userResult = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    const userId = userResult.rows[0].id;

    // Insert event into database to get eventId
    const result = await pool.query(
      'INSERT INTO events (title, description, eventDate, fromTime, toTime, eventType, place, maxAttendees, registration, category, paymentType, cost, userId) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) RETURNING id',
      [title, description, eventDate, formattedFromTime, formattedToTime, eventType, place, maxAttendees, registration, category, paymentType, finalCost, userId]
    );
    const eventId = result.rows[0].id;
    const eventTitle = result.rows[0].title;

    // Put the creator in paritcipant as host
    const paritcipant = await pool.query(
      'INSERT INTO participants (event_id, participant_id) VALUES ($1, $2) RETURNING id',
      [eventId, userId]
    );

    const file_main = req.files.titleImage[0];
    const titleImageUrl = await uploadImageToSupabase(file_main)

    const imageUrls = [];

    for (const file of req.files.otherImages) {
      const imageUrl = await uploadImageToSupabase(file);
      imageUrls.push(imageUrl);
    }

   // Update the database with image URLs
    await pool.query(
      'UPDATE events SET titleimageurl = $1, otherimageurls = $2 WHERE id = $3',
      [titleImageUrl, imageUrls, eventId]
    );

    const { data, error: chatError } = await supabase
    .from('messages')
    .insert([
      {
        event_id: eventId,
        is_group_meta: true,
        created_at: new Date().toISOString()
      }
    ])
    .single();
  
    console.log(data);
    if (chatError) {
      console.error('Error creating group chat:', chatError);
      return res.status(500).json({ error: 'Failed to create chat group' });
    }
    
    res.status(201).json({ message: 'Event created successfully', eventId });
  } catch (error) {
    console.error('Error submitting event:', error);
    res.status(500).json({ error: error.message });
  }
});

app.get('/userId/:email', async (req, res) => {
  try {
    const { email } = req.params;

    const user = await pool.query('SELECT id FROM users WHERE email = $1',
      [email]
    );
    const use = user.rows[0].id

    if (user) {
      res.json({ userId: use });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error('Error fetching user by email:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.post('/send-request', async (req, res) => {

  const { email, id } = req.body;
  console.log(email)
  try {
    const user = await pool.query('SELECT id FROM users WHERE email = $1',
      [email]
    );
    const userId = user.rows[0].id

    const existingRequest = await pool.query(
      'SELECT * FROM Requests WHERE user_id = $1 AND event_id = $2',
      [userId, id]
    );

    if (existingRequest.rows.length > 0) {
      return res.status(400).json({ error: 'You have already sent a request.' });
    }

    await pool.query(
      'INSERT INTO Requests (user_id, event_id) VALUES ($1, $2 )',
      [userId, id]
    );

    res.status(200).json({ message: 'Request sent successfully.' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/event_host_participate/:email', async (req, res) => {
  try {
    const { email } = req.params;
    const user = await pool.query('SELECT id FROM users WHERE email = $1',
      [email]
    );
    const use = user.rows[0].id
    const eventHost =await pool.query('SELECT id,title, eventdate, eventtype, place, category, paymenttype, cost, titleimageurl FROM events WHERE userid =$1',
      [use]
    );

    const participating_event = await pool.query(
      `SELECT events.id AS event_id, events.title, events.titleimageurl, events.eventtype, events.cost, events.eventdate, events.category
        FROM participants
        JOIN events ON participants.event_id = events.id
        WHERE participants.participant_id = $1`,
        [use]
    );
    console.log(participating_event.rows)

    res.status(200).json({eventHosting: eventHost.rows, eventParticipating: participating_event.rows});
  } catch (error) {
    console.error('Error fetching event by email:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.get('/profile/:email', async (req, res) => {
  try {
    const { email } = req.params;
    const user = await pool.query('SELECT username, email, profile FROM users WHERE email = $1',
      [email]
    );

    console.log(user.rows);
    res.status(200).json({info: user.rows[0]});
  } catch (error) {
    console.error('Error fetching user by email:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.post('/set_profile', upload.fields([{ name: 'profilePhoto', maxCount: 1 }]), async (req, res) => {
  try {
    const {email, firstName, lastName, city, gender}  = req.body;
    const profileImage = req.files.profilePhoto[0];
    let imageUrl = null;
    if (profileImage) {
      imageUrl = await uploadImageToSupabase(profileImage);
    }

    const userResult = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    

    if (userResult.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if profile exists in the users table as a JSON column
    const profileResult = await pool.query('SELECT profile FROM users WHERE email = $1', [email]);


    if (!profileResult.rows[0].profile) {
      // Create a new profile if it doesn't exist
      const newProfile = {
        firstName: firstName || '',
        lastName: lastName || '',
        city: city || '',
        gender: gender || '',
        profileImage: imageUrl
      };

      await pool.query(
        'UPDATE users SET profile = $1 WHERE email = $2',
        [newProfile, email]
      );
    } else {
      const existingProfile = profileResult.rows[0].profile;
      console.log(existingProfile)
      const updatedProfile = {
        ...existingProfile,
        firstName: firstName || existingProfile.firstName,
        lastName: lastName || existingProfile.lastName,
        city: city || existingProfile.city,
        gender: gender || existingProfile.gender,
        profileImage: imageUrl || existingProfile.profileImage
      };
      

      await pool.query(
        'UPDATE users SET profile = $1 WHERE email = $2',
        [updatedProfile, email]
      );
    }



    res.status(200).json({ message: 'Profile updated successfully' });


  } catch (error) {
    console.error('Error setting user profile', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.get('/api/groups/:email', async (req, res) => {

  try {
    const { email } = req.params;
    console.log(email)
      const user = await pool.query('SELECT id FROM users WHERE email = $1',
        [email]
      );
      const userId = user.rows[0].id
      console.log(userId)
    const groups = await pool.query(`
      SELECT e.id AS event_id, e.title AS group_name
      FROM participants p
      JOIN events e ON p.event_id = e.id
      WHERE p.participant_id = $1
    `, [userId]);
    console.log(groups.rows)
    res.json(groups.rows);
  } catch (error) {
    console.error('Error fetching group chats:', error);
    res.status(500).json({ error: 'Failed to fetch group chats' });
  }
});

app.post('/api/Send_Message', async (req, res) => {
  const { email, content, chatId } = req.body;

  if (!email || !content || !chatId) {
    return res.status(400).json({ error: 'Missing fields' });
  }

  try {
    const { data, error } = await supabase
      .from('messages')
      .insert([
        {
          sender_email: email,
          content,
          event_id: chatId,
          created_at: new Date().toISOString()
        }
      ])
      .select()
      .single();

    if (error) throw error;
      console.log(data)
    res.status(200).json({ message: 'Message sent', data });
  } catch (err) {
    console.error('Error sending message:', err);
    res.status(500).json({ error: 'Failed to send message' });
  }
});
app.get("/api/messages/:event_id", async (req, res) => {
  const { event_id } = req.params;

  try {
    const { data, error } = await supabase
    .from("messages")
    .select(`
      id,
      content,
      event_id,
      sender_email,
      is_group_meta,
      created_at,
      users!left(username))
    `)
    .eq("event_id", event_id)
    .order("created_at", { ascending: true });
  
  console.log(data, error);  // Check the data and any potential error
  
  
  
    if (error) {
      console.error("Supabase error:", error.message);
      return res.status(500).json({ error: "Failed to fetch messages" });
    }

    res.json(data);
  } catch (err) {
    console.error("Server error:", err.message);
    res.status(500).json({ error: "Internal server error" });
  }
});








