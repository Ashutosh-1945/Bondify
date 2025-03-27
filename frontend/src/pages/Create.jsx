import { use, useState } from "react";
import dayjs from "dayjs";
import axios from "axios";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { TextField, Button, MenuItem, FormControl, InputLabel, Select, RadioGroup, FormControlLabel, Radio, Box, Typography } from "@mui/material";

const categories = ["Tech", "Health", "Sports", "Music", "Gaming", "Business"];
const places = ["Indoor", "Outdoor", "Mixed"];

export default function Create() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [eventType, setEventType] = useState("online");
  const [category, setCategory] = useState("");
  const [place, setPlace] = useState("");
  const [registration, setRegistration] = useState("open");
  const [eventDate, setEventDate] = useState(dayjs());
  const [fromTime, setFromTime] = useState(dayjs());
  const [toTime, setToTime] = useState(dayjs().add(1, "hour")); // Default +1 hour
  const [paymentType, setPaymentType] = useState("free");
  const [cost, setCost] = useState("");

  const [maxAttendees, setMaxattendes] = useState("");
  const [titleImage, setTitleImage] = useState(null);
  const [titleImagePreview, setTitleImagePreview] = useState(null);
  const [otherImages, setOtherImages] = useState([]);
  const [otherImagesPreview, setOtherImagesPreview] = useState([]);

  const handleTitleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
        setTitleImage(file); // Store actual file
        setTitleImagePreview(URL.createObjectURL(file)); // Create preview URL
    }
  };

  const handleOtherImagesUpload = (event) => {
      const files = Array.from(event.target.files);
      setOtherImages(files); // Store actual files
      setOtherImagesPreview(files.map((file) => URL.createObjectURL(file))); // Generate previews
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const email = localStorage.getItem("email");
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("eventDate", eventDate.toISOString());
    formData.append("fromTime", fromTime.toISOString());
    formData.append("toTime", toTime.toISOString());
    formData.append("eventType", eventType);
    formData.append("place", place);
    formData.append("maxAttendees", maxAttendees);
    formData.append("registration", registration);
    formData.append("category", category);
    formData.append("paymentType", paymentType);
    formData.append("cost", cost);
    console.log(titleImage)
    if (titleImage) formData.append("titleImage", titleImage);
    otherImages.forEach((img) => formData.append("otherImages", img));
    formData.append("email", email);
    formData.forEach((value, key) => {
      console.log(`${key}:`, value);
  });


  try {
    const response = await axios.post('http://localhost:3005/create_event', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    alert('Event created successfully!');
    console.log(response.data);
  } catch (error) {
    console.error('Error creating event:', error);
    alert('Failed to create event');
  }
  };

  return (
    <Box sx={{ maxWidth: "600px", margin: "auto", padding: 3, display: "flex", flexDirection: "column", gap: 2 }}>
      <h2>Create a Meetup</h2>

      <TextField label="Meetup Title" variant="outlined" fullWidth required value={title} onChange={(e) => setTitle(e.target.value)} />
      <TextField label="Description" variant="outlined" fullWidth multiline rows={4} required value={description} onChange={(e) => setDescription(e.target.value)} />

      {/* Date Picker */}
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DatePicker label="Event Date" value={eventDate} onChange={(newValue) => setEventDate(newValue)} />
      </LocalizationProvider>

      {/* Time Pickers (Side by Side) */}
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Box sx={{ display: "flex", gap: 2 }}>
          <TimePicker label="From" value={fromTime} onChange={(newValue) => setFromTime(newValue)} />
          <TimePicker label="To" value={toTime} onChange={(newValue) => setToTime(newValue)} />
        </Box>
      </LocalizationProvider>

      <FormControl fullWidth>
        <InputLabel>Event Type</InputLabel>
        <Select value={eventType} onChange={(e) => setEventType(e.target.value)}>
          <MenuItem value="online">Online</MenuItem>
          <MenuItem value="offline">Offline</MenuItem>
        </Select>
      </FormControl>

      {eventType === "offline" && (
        <>
          <FormControl fullWidth>
            <InputLabel>Place</InputLabel>
            <Select value={place} onChange={(e) => setPlace(e.target.value)} required>
              {places.map((pl) => (
                <MenuItem key={pl} value={pl}>
                  {pl}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField label="Event Location (Address)" variant="outlined" fullWidth required />
        </>
      )}

      <TextField label="Max Attendees" type="number" variant="outlined" fullWidth required value={maxAttendees} onChange={(e) => setMaxattendes(e.target.value)} />

      <FormControl>
        <RadioGroup row value={registration} onChange={(e) => setRegistration(e.target.value)}>
          <FormControlLabel value="open" control={<Radio />} label="Open" />
          <FormControlLabel value="request" control={<Radio />} label="Request Required" />
        </RadioGroup>
      </FormControl>

      <FormControl fullWidth>
        <InputLabel>Category</InputLabel>
        <Select value={category} onChange={(e) => setCategory(e.target.value)} required>
          {categories.map((cat) => (
            <MenuItem key={cat} value={cat}>
              {cat}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl fullWidth>
        <InputLabel>Payment Type</InputLabel>
        <Select value={paymentType} onChange={(e) => setPaymentType(e.target.value)}>
          <MenuItem value="free">Free</MenuItem>
          <MenuItem value="paid">Paid</MenuItem>
        </Select>
      </FormControl>

      {paymentType === "paid" && (
        <TextField
          label="Cost (in Rs.)"
          type="number"
          variant="outlined"
          fullWidth
          required
          value={cost}
          onChange={(e) => setCost(e.target.value)}
        />
      )}

      <Box sx={{ maxWidth: "600px", margin: "auto", padding: 3, display: "flex", flexDirection: "column", gap: 2 }}>
        <Typography variant="h5">Upload Images</Typography>

        <input type="file" accept="image/*" onChange={handleTitleImageUpload} />
        {titleImage && <img src={titleImagePreview} alt="Title" style={{ width: "100%", maxHeight: "300px", objectFit: "cover", borderRadius: "8px" }} />}

        <input type="file" accept="image/*" multiple onChange={handleOtherImagesUpload} />
        <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
          {otherImagesPreview.map((img, index) => (
            <img key={index} src={img} alt={`Other ${index}`} style={{ width: "100px", height: "100px", objectFit: "cover", borderRadius: "8px" }} />
          ))}
        </Box>

        <Button variant="contained" color="primary">Upload</Button>
      </Box>

      <Button onClick={handleSubmit} variant="contained" color="primary" fullWidth>
        Create Meetup
      </Button>
    </Box>
  );
}
