import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors())

const mongoString = process.env.ATLAS_URI;

mongoose.connect(mongoString, {
  dbName: 'onesec' 
});
const databaseConnectivity = mongoose.connection;

databaseConnectivity.on("error", (error) => {
    console.error("Failed to connect to database:", error);
});

databaseConnectivity.once("connected", () => {
    console.log("Database connected");
});

const Schema = mongoose.Schema;

const jobSchema = new Schema({
  job_id: Number,
  company_name: String,
  title: String,
  description: String,
  max_salary: Number,
  pay_period: String,
  location: String,
  company_id: Number,
  views: Number,
  min_salary: Number,
  formatted_work_type: String,
  applies: Number,
  application_type: String,
  skills_desc: String,
  work_type: String,
  currency: String,
  compensation_type: String
});

const JobModel = mongoose.model('Job', jobSchema, 'jobs'); 

app.get("/", (req, res) => {
    res.status(200).json({
        time: Date.now(),
        status: "Healthy"
    });
});

app.get("/jobs", async (req, res) => {
    try {
        const data = await JobModel.find();
        console.log("Retrieved data:", data);
        res.status(200).json(data);
    } catch (err) {
        console.error("Error retrieving data:", err);
        res.status(500).json({
            message: `Internal server error ${err}`
        });
    }
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});
