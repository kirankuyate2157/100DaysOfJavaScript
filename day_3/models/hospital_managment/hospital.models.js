import mongoose from "mongoose"
import { Patient } from './patient.models';
const hospitalSchema = new mongoose.Schema({
    name: { type: String, required: true },
    addressLine1: { type: String, required: true },
    addressLine2: { type: String, required: true },
    city: { type: String, required: true },
    pincode: { type: String, required: true },
    specializationIn: [{ type: String }],
    contacts: [{ type: Number }],
    Patients: [{ type: mongoose.Schema.Types.ObjectId, ref: "Patient" }]
}, { timestamps: true });

export const Hospital = mongoose.model("Hospital", hospitalSchema)
