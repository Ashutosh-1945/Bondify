import { use, useState } from "react";
import dayjs from "dayjs";
import axios from "axios";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import ReactMarkdown from 'react-markdown';
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
<Box
  sx={{
    minHeight: "100vh",
    width: "100%",
    boxSizing: "border-box",
    p: 3,
    backgroundColor: "#fefefe",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
  }}
>
  <Typography
    variant="h4"
    align="center"
    sx={{
      mb: 3,
      fontWeight: "bold",
      color: "purple",
      textTransform: "uppercase",
      letterSpacing: 1,
    }}
  >
    Meetup Details
  </Typography>

  <Box
    sx={{
      display: "flex",
      flexDirection: { xs: "column", md: "row" },
      gap: 3,
      width: "100%",
      maxWidth: "1200px",
      mx: "auto",
      flex: 1,
    }}
  >
    {/* LEFT SIDE */}
    <Box
      sx={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        gap: 2,
        overflowY: "visible", // fix cut labels
        pr: 1,
      }}
    >
      <TextField
        label="Meetup Title"
        fullWidth
        value={title}
        size="small"
        onChange={(e) => setTitle(e.target.value)}
      />

      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DatePicker
          label="Event Date"
          value={eventDate}
          onChange={(newValue) => setEventDate(newValue)}
          slotProps={{ textField: { size: "small", fullWidth: true } }}
        />
      </LocalizationProvider>

      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Box sx={{ display: "flex", gap: 2 }}>
          <TimePicker
            label="From"
            value={fromTime}
            onChange={(newValue) => setFromTime(newValue)}
            slotProps={{ textField: { size: "small", fullWidth: true } }}
          />
          <TimePicker
            label="To"
            value={toTime}
            onChange={(newValue) => setToTime(newValue)}
            slotProps={{ textField: { size: "small", fullWidth: true } }}
          />
        </Box>
      </LocalizationProvider>

      <FormControl fullWidth size="small">
        <InputLabel>Event Type</InputLabel>
        <Select value={eventType} onChange={(e) => setEventType(e.target.value)}>
          <MenuItem value="online">Online</MenuItem>
          <MenuItem value="offline">Offline</MenuItem>
        </Select>
      </FormControl>

      {eventType === "offline" && (
        <>
          <FormControl fullWidth size="small">
            <InputLabel>Place</InputLabel>
            <Select value={place} onChange={(e) => setPlace(e.target.value)}>
              {places.map((pl) => (
                <MenuItem key={pl} value={pl}>
                  {pl}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField label="Event Location (Address)" fullWidth size="small" />
        </>
      )}

      <TextField
        label="Max Attendees"
        type="number"
        fullWidth
        size="small"
        value={maxAttendees}
        onChange={(e) => setMaxattendes(e.target.value)}
      />

      <FormControl size="small">
        <RadioGroup row value={registration} onChange={(e) => setRegistration(e.target.value)}>
          <FormControlLabel value="open" control={<Radio />} label="Open" />
          <FormControlLabel value="request" control={<Radio />} label="Request Required" />
        </RadioGroup>
      </FormControl>

      <FormControl fullWidth size="small">
        <InputLabel>Category</InputLabel>
        <Select value={category} onChange={(e) => setCategory(e.target.value)}>
          {categories.map((cat) => (
            <MenuItem key={cat} value={cat}>
              {cat}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl fullWidth size="small">
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
          fullWidth
          size="small"
          value={cost}
          onChange={(e) => setCost(e.target.value)}
        />
      )}

<Box>
  <Typography variant="subtitle1" sx={{ mb: 1 }}>
    Upload Images
  </Typography>

  {/* Title Image */}
  <Box
    sx={{
      border: "1px solid #ccc",
      borderRadius: 2,
      p: 2,
      mb: 2,
      backgroundColor: "#f9f9f9",
    }}
  >
    <Typography variant="subtitle2" sx={{ mb: 1 }}>
      Title Image
    </Typography>
    <input type="file" accept="image/*" onChange={handleTitleImageUpload} />
    {titleImage && (
      <img
        src={titleImagePreview}
        alt="Title"
        style={{
          width: "100%",
          maxHeight: "200px",
          objectFit: "cover",
          borderRadius: "8px",
          marginTop: "8px",
        }}
      />
    )}
  </Box>

  {/* Other Images */}
  <Box
    sx={{
      border: "1px solid #ccc",
      borderRadius: 2,
      p: 2,
      backgroundColor: "#f9f9f9",
    }}
  >
    <Typography variant="subtitle2" sx={{ mb: 1 }}>
      Other Images
    </Typography>
    <input type="file" accept="image/*" multiple onChange={handleOtherImagesUpload} />
    <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mt: 1 }}>
      {otherImagesPreview.map((img, index) => (
        <img
          key={index}
          src={img}
          alt={`Other ${index}`}
          style={{
            width: "80px",
            height: "80px",
            objectFit: "cover",
            borderRadius: "8px",
          }}
        />
      ))}
    </Box>
  </Box>
</Box>
    </Box>

    {/* RIGHT SIDE */}
    <Box
      sx={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        gap: 2,
        overflowY: "visible", // fix here too
        pl: 1,
      }}
    >
      <Typography variant="subtitle1">Description (Markdown Supported)</Typography>
      <TextField
        placeholder="Use **bold**, # headings, - lists"
        multiline
        minRows={12}
        fullWidth
        size="small"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        sx={{
          fontFamily: "monospace",
          whiteSpace: "pre-wrap",
        }}
      />

      <Typography variant="subtitle2">Live Preview</Typography>
      <Box
        sx={{
          border: "1px solid #ccc",
          borderRadius: 2,
          p: 2,
          minHeight: "100px",
          backgroundColor: "#fafafa",
          fontFamily: "monospace",
          whiteSpace: "pre-wrap",
        }}
      >
        <ReactMarkdown>{description}</ReactMarkdown>
      </Box>
    </Box>
  </Box>

  <Box sx={{ maxWidth: "600px", mt: 3, mx: "auto" }}>
    <Button onClick={handleSubmit} variant="contained" color="primary" fullWidth>
      Create Meetup
    </Button>
  </Box>
</Box>


  );
}
