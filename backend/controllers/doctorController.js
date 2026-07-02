import Doctor from '../models/Doctor.js';

export const getAllDoctors = async (req, res) => {
  try {
    const { specialization, city, rating, page = 1, limit = 10 } = req.query;

    const query = { isVerified: true, isActive: true };
    if (specialization) {
      query.specialization = specialization;
    }
    if (city) {
      query.city = { $regex: city, $options: 'i' };
    }
    if (rating) {
      query.rating = { $gte: parseFloat(rating) };
    }

    const doctors = await Doctor.find(query)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ rating: -1 });

    const total = await Doctor.countDocuments(query);

    res.json({
      success: true,
      data: doctors,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getDoctorById = async (req, res) => {
  try {
    const { id } = req.params;

    const doctor = await Doctor.findById(id);

    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    res.json({
      success: true,
      data: doctor,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createDoctor = async (req, res) => {
  try {
    const {
      name,
      email,
      mobileNumber,
      specialization,
      experience,
      qualifications,
      city,
      clinicAddress,
      consultationFee,
      availability,
      licenseNumber,
    } = req.body;

    const existingDoctor = await Doctor.findOne({ email });
    if (existingDoctor) {
      return res.status(409).json({ message: 'Doctor email already exists' });
    }

    const doctor = new Doctor({
      name,
      email,
      mobileNumber,
      specialization,
      experience,
      qualifications,
      city,
      clinicAddress,
      consultationFee,
      availability,
      licenseNumber,
    });

    await doctor.save();

    res.status(201).json({
      success: true,
      message: 'Doctor created successfully',
      data: doctor,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateDoctor = async (req, res) => {
  try {
    const { id } = req.params;

    const doctor = await Doctor.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    res.json({
      success: true,
      message: 'Doctor updated successfully',
      data: doctor,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteDoctor = async (req, res) => {
  try {
    const { id } = req.params;

    const doctor = await Doctor.findByIdAndUpdate(id, { isActive: false }, { new: true });

    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    res.json({
      success: true,
      message: 'Doctor deactivated successfully',
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const searchDoctors = async (req, res) => {
  try {
    const { query } = req.query;

    if (!query || query.length < 2) {
      return res.status(400).json({ message: 'Search query must be at least 2 characters' });
    }

    const doctors = await Doctor.find({
      $or: [
        { name: { $regex: query, $options: 'i' } },
        { specialization: { $regex: query, $options: 'i' } },
        { city: { $regex: query, $options: 'i' } },
      ],
      isVerified: true,
      isActive: true,
    }).limit(10);

    res.json({
      success: true,
      data: doctors,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
