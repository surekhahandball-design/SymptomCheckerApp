import Admin from '../models/Admin.js';
import Symptom from '../models/Symptom.js';
import Disease from '../models/Disease.js';
import Doctor from '../models/Doctor.js';
import HealthTip from '../models/HealthTip.js';

export const seedDatabase = async () => {
  try {
    // 1. Seed Admin
    const adminCount = await Admin.countDocuments();
    if (adminCount === 0) {
      console.log('Seeding admin user...');
      const admin = new Admin({
        email: 'admin@symptomchecker.com',
        password: 'admin@123',
        name: 'System Administrator',
        permissions: ['all'],
        isActive: true,
      });
      await admin.save();
      console.log('Admin user seeded: admin@symptomchecker.com / admin@123');
    }

    // 2. Seed Symptoms
    const symptomCount = await Symptom.countDocuments();
    if (symptomCount === 0) {
      console.log('Seeding symptoms...');
      const symptomsData = [
        // General
        { name: 'Fever', category: 'General', description: 'Elevated body temperature above normal range (37°C or 98.6°F)' },
        { name: 'Fatigue', category: 'General', description: 'Feeling of constant tiredness or weakness' },
        { name: 'Weight Loss', category: 'General', description: 'Unexplained decrease in body weight' },
        { name: 'Body Aches', category: 'General', description: 'Unpleasant feelings or physical discomfort in the muscles' },
        { name: 'Chills', category: 'General', description: 'Sensation of coldness accompanied by shivering' },
        
        // Respiratory
        { name: 'Cough', category: 'Respiratory', description: 'A sudden, noisy expulsion of air from the lungs' },
        { name: 'Sore Throat', category: 'Respiratory', description: 'Pain, itchiness, or irritation in the throat' },
        { name: 'Runny Nose', category: 'Respiratory', description: 'Excess nasal drainage or congestion' },
        { name: 'Shortness of Breath', category: 'Respiratory', description: 'Difficulty breathing or feeling winded' },
        { name: 'Chest Pain', category: 'Respiratory', description: 'Discomfort or pain felt anywhere along the front of the chest' },
        
        // Digestive
        { name: 'Nausea', category: 'Digestive', description: 'A feeling of sickness with an inclination to vomit' },
        { name: 'Vomiting', category: 'Digestive', description: 'Forceful expulsion of stomach contents through the mouth' },
        { name: 'Diarrhea', category: 'Digestive', description: 'Frequent, loose, or watery bowel movements' },
        { name: 'Stomach Pain', category: 'Digestive', description: 'Cramping or aching pain in the abdomen' },
        { name: 'Loss of Appetite', category: 'Digestive', description: 'A reduced desire to eat' },
        
        // Neurological
        { name: 'Headache', category: 'Neurological', description: 'Pain in any region of the head' },
        { name: 'Dizziness', category: 'Neurological', description: 'Sensation of spinning, off-balance, or lightheadedness' },
        { name: 'Numbness', category: 'Neurological', description: 'Loss of sensation or feeling in a part of the body' },
        { name: 'Confusion', category: 'Neurological', description: 'Inability to think clearly or quickly' },
        
        // Skin
        { name: 'Rash', category: 'Skin', description: 'Area of irritated or swollen skin' },
        { name: 'Itching', category: 'Skin', description: 'An uncomfortable, irritating sensation that makes you want to scratch' },
        
        // Mental Health
        { name: 'Anxiety', category: 'Mental Health', description: 'Feelings of worry, anxiety, or fear strong enough to interfere with daily activities' },
        { name: 'Depressed Mood', category: 'Mental Health', description: 'Persistent feeling of sadness or loss of interest' },
        { name: 'Insomnia', category: 'Mental Health', description: 'Habitual sleeplessness or inability to sleep' },
        
        // Women Health
        { name: 'Menstrual Cramps', category: 'Women Health', description: 'Throbbing or cramping pains in the lower abdomen before/during periods' },
        
        // Children
        { name: 'Diaper Rash', category: 'Children', description: 'Patch of bright red skin on a baby\'s bottom' },
      ];
      await Symptom.insertMany(symptomsData);
      console.log('Symptoms seeded.');
    }

    // 3. Seed Diseases
    const diseaseCount = await Disease.countDocuments();
    if (diseaseCount === 0) {
      console.log('Seeding diseases...');
      const diseasesData = [
        {
          name: 'Common Cold',
          symptoms: ['Cough', 'Sore Throat', 'Runny Nose', 'Fever', 'Fatigue'],
          description: 'A common viral infection of the nose and throat, usually harmless, with symptoms resolving in 7 to 10 days.',
          causes: ['Rhinoviruses', 'Contact with respiratory droplets of infected person', 'Weakened immune system'],
          treatment: 'Get plenty of rest, stay hydrated, and use over-the-counter medication to ease symptoms.',
          doctorType: ['General Practitioner', 'Pediatrician'],
          severity: 'low',
          medicines: [
            { name: 'Paracetamol', dosage: '500mg', frequency: 'Three times a day as needed' },
            { name: 'Cetirizine', dosage: '10mg', frequency: 'Once daily at bedtime' }
          ],
          tests: ['None required (Clinical diagnosis)'],
          precautions: [
            'Wash hands frequently with soap and water.',
            'Avoid close contact with people who have colds.',
            'Cover your mouth and nose when coughing or sneezing.'
          ],
          emergencyWarning: 'Seek medical attention if symptoms last more than 10 days, or if you develop high fever, difficulty breathing, or severe chest pain.',
          healthTips: ['Drink warm fluids like herbal tea with honey.', 'Use a humidifier in your room.']
        },
        {
          name: 'Food Poisoning (Gastroenteritis)',
          symptoms: ['Nausea', 'Vomiting', 'Diarrhea', 'Stomach Pain', 'Loss of Appetite', 'Fever'],
          description: 'An illness caused by eating contaminated food. Infectious organisms or their toxins are the most common causes.',
          causes: ['Bacteria (Salmonella, E. coli)', 'Viruses (Norovirus)', 'Contaminated water or undercooked food'],
          treatment: 'Rehydration is the most critical treatment. Drink plenty of water and oral rehydration solution (ORS).',
          doctorType: ['Gastroenterologist', 'General Practitioner'],
          severity: 'medium',
          medicines: [
            { name: 'ORS (Oral Rehydration Salts)', dosage: '1 sachet in 1L water', frequency: 'Drink throughout the day' },
            { name: 'Loperamide', dosage: '2mg', frequency: 'After each loose stool (consult doctor first)' }
          ],
          tests: ['Stool Test', 'Complete Blood Count (CBC)'],
          precautions: [
            'Wash hands, utensils, and food surfaces often.',
            'Keep raw foods separate from ready-to-eat foods.',
            'Cook foods to a safe temperature.'
          ],
          emergencyWarning: 'Seek immediate care if you experience high fever, severe abdominal pain, inability to keep fluids down, or signs of dehydration (dizziness, dry mouth).',
          healthTips: ['Stick to the BRAT diet (Bananas, Rice, Applesauce, Toast).', 'Avoid dairy, alcohol, and caffeine.']
        },
        {
          name: 'Migraine',
          symptoms: ['Headache', 'Nausea', 'Dizziness', 'Fatigue'],
          description: 'A neurological condition that can cause multiple symptoms, most notably a throbbing, pulsing headache on one side of the head.',
          causes: ['Hormonal changes', 'Stress and anxiety', 'Sensory stimuli (bright lights, loud sounds)', 'Sleep deprivation'],
          treatment: 'Rest in a quiet, dark room, use cold compresses, and take pain relievers or migraine-specific medications.',
          doctorType: ['Neurologist', 'General Practitioner'],
          severity: 'medium',
          medicines: [
            { name: 'Ibuprofen', dosage: '400mg', frequency: 'Every 6-8 hours as needed' },
            { name: 'Sumatriptan', dosage: '50mg', frequency: 'Take at the onset of migraine' }
          ],
          tests: ['MRI Scan (to rule out other conditions)', 'CT Scan of the brain'],
          precautions: [
            'Identify and avoid triggers (specific foods, stress).',
            'Maintain regular sleep patterns.',
            'Stay hydrated and eat meals at regular times.'
          ],
          emergencyWarning: 'Seek immediate care for an abrupt, severe headache like a thunderclap, or headache accompanied by fever, stiff neck, confusion, seizures, or double vision.',
          healthTips: ['Keep a headache diary to track triggers.', 'Practice relaxation techniques like deep breathing or yoga.']
        },
        {
          name: 'COVID-19',
          symptoms: ['Fever', 'Cough', 'Shortness of Breath', 'Fatigue', 'Sore Throat', 'Body Aches', 'Loss of Appetite'],
          description: 'An infectious disease caused by the SARS-CoV-2 virus, affecting the respiratory system with mild to critical severity.',
          causes: ['SARS-CoV-2 coronavirus transmission via respiratory droplets'],
          treatment: 'Supportive care including rest, fluids, and pain relievers. Antivirals may be prescribed for high-risk individuals.',
          doctorType: ['Pulmonologist', 'Infectious Disease Specialist', 'General Practitioner'],
          severity: 'high',
          medicines: [
            { name: 'Paracetamol', dosage: '650mg', frequency: 'Every 6 hours as needed for fever' },
            { name: 'Cough Suppressant', dosage: '10ml', frequency: 'Three times a day' }
          ],
          tests: ['RT-PCR Test', 'Rapid Antigen Test'],
          precautions: [
            'Isolate from other family members.',
            'Wear a high-quality mask (N95) if contact is necessary.',
            'Keep the living space well-ventilated.'
          ],
          emergencyWarning: 'Seek emergency care immediately if you have trouble breathing, persistent pain or pressure in the chest, new confusion, or pale, gray, or blue skin, lips, or nail beds.',
          healthTips: ['Use a pulse oximeter to monitor oxygen levels.', 'Get absolute bed rest.']
        },
        {
          name: 'Hypertension (High Blood Pressure)',
          symptoms: ['Headache', 'Dizziness', 'Fatigue'],
          description: 'A chronic medical condition in which the blood pressure in the arteries is persistently elevated, increasing heart disease risk.',
          causes: ['Genetics', 'High sodium (salt) intake', 'Lack of physical activity', 'Stress', 'Obesity'],
          treatment: 'Long-term management including lifestyle changes (diet, exercise) and daily antihypertensive medications.',
          doctorType: ['Cardiologist', 'General Practitioner'],
          severity: 'high',
          medicines: [
            { name: 'Amlodipine', dosage: '5mg', frequency: 'Once daily in the morning' },
            { name: 'Telmisartan', dosage: '40mg', frequency: 'Once daily' }
          ],
          tests: ['Blood Pressure Measurement', 'Electrocardiogram (ECG)', 'Blood Sugar and Cholesterol tests'],
          precautions: [
            'Reduce dietary sodium (salt) intake.',
            'Engage in moderate exercise regularly (30 mins a day).',
            'Avoid tobacco use and limit alcohol consumption.'
          ],
          emergencyWarning: 'Seek emergency medical help immediately if blood pressure is 180/120 mmHg or higher and you have chest pain, shortness of breath, back pain, numbness, or difficulty speaking.',
          healthTips: ['Monitor your blood pressure regularly at home.', 'Adopt the DASH diet (high in vegetables, fruits, and low-fat dairy).']
        }
      ];
      await Disease.insertMany(diseasesData);
      console.log('Diseases seeded.');
    }

    // 4. Seed Doctors
    const doctorCount = await Doctor.countDocuments();
    if (doctorCount === 0) {
      console.log('Seeding doctors...');
      const doctorsData = [
        {
          name: 'Dr. Jane Smith',
          email: 'dr.janesmith@symptomchecker.com',
          mobileNumber: '1234567890',
          specialization: 'General Practitioner',
          experience: 10,
          qualifications: ['MBBS', 'MD (Internal Medicine)'],
          city: 'New York',
          clinicAddress: '123 Health Ave, Manhattan, NY',
          consultationFee: 80,
          rating: 4.8,
          totalReviews: 154,
          availability: {
            monday: { from: '09:00', to: '17:00' },
            tuesday: { from: '09:00', to: '17:00' },
            wednesday: { from: '09:00', to: '17:00' },
            thursday: { from: '09:00', to: '17:00' },
            friday: { from: '09:00', to: '17:00' }
          },
          licenseNumber: 'GP-103948',
          isVerified: true,
          isActive: true
        },
        {
          name: 'Dr. Robert Chen',
          email: 'dr.robertchen@symptomchecker.com',
          mobileNumber: '9876543210',
          specialization: 'Cardiologist',
          experience: 15,
          qualifications: ['MBBS', 'MD (Cardiology)', 'FACC'],
          city: 'Los Angeles',
          clinicAddress: '456 Heartbeat Blvd, Los Angeles, CA',
          consultationFee: 150,
          rating: 4.9,
          totalReviews: 210,
          availability: {
            monday: { from: '10:00', to: '16:00' },
            tuesday: { from: '10:00', to: '16:00' },
            wednesday: { from: '10:00', to: '16:00' },
            thursday: { from: '10:00', to: '16:00' }
          },
          licenseNumber: 'CARD-93049',
          isVerified: true,
          isActive: true
        },
        {
          name: 'Dr. Sarah Patel',
          email: 'dr.sarahpatel@symptomchecker.com',
          mobileNumber: '5551234567',
          specialization: 'Neurologist',
          experience: 12,
          qualifications: ['MBBS', 'MD (Neurology)', 'ABPN Board Certified'],
          city: 'Chicago',
          clinicAddress: '789 Synapse Way, Chicago, IL',
          consultationFee: 130,
          rating: 4.7,
          totalReviews: 89,
          availability: {
            tuesday: { from: '09:00', to: '17:00' },
            wednesday: { from: '09:00', to: '17:00' },
            thursday: { from: '09:00', to: '17:00' },
            friday: { from: '09:00', to: '17:00' }
          },
          licenseNumber: 'NEUR-49204',
          isVerified: true,
          isActive: true
        },
        {
          name: 'Dr. David Miller',
          email: 'dr.davidmiller@symptomchecker.com',
          mobileNumber: '5557654321',
          specialization: 'Dermatologist',
          experience: 8,
          qualifications: ['MBBS', 'MD (Dermatology)'],
          city: 'Houston',
          clinicAddress: '101 Skin Care Rd, Houston, TX',
          consultationFee: 90,
          rating: 4.6,
          totalReviews: 72,
          availability: {
            monday: { from: '09:00', to: '15:00' },
            wednesday: { from: '09:00', to: '15:00' },
            friday: { from: '09:00', to: '15:00' }
          },
          licenseNumber: 'DERM-39401',
          isVerified: true,
          isActive: true
        },
        {
          name: 'Dr. Emily Johnson',
          email: 'dr.emilyjohnson@symptomchecker.com',
          mobileNumber: '1239874560',
          specialization: 'Pediatrician',
          experience: 11,
          qualifications: ['MBBS', 'MD (Pediatrics)', 'FAAP'],
          city: 'New York',
          clinicAddress: '202 Kid Health Dr, Manhattan, NY',
          consultationFee: 85,
          rating: 4.9,
          totalReviews: 130,
          availability: {
            monday: { from: '09:00', to: '17:00' },
            tuesday: { from: '09:00', to: '17:00' },
            wednesday: { from: '09:00', to: '17:00' },
            thursday: { from: '09:00', to: '17:00' },
            friday: { from: '09:00', to: '17:00' }
          },
          licenseNumber: 'PED-83940',
          isVerified: true,
          isActive: true
        }
      ];
      await Doctor.insertMany(doctorsData);
      console.log('Doctors seeded.');
    }

    // 5. Seed HealthTips
    const tipCount = await HealthTip.countDocuments();
    if (tipCount === 0) {
      console.log('Seeding health tips...');
      const tipsData = [
        {
          title: 'Stay Hydrated',
          description: 'Drinking at least 8-10 glasses of water daily helps maintain fluid balance, flush out toxins, and boosts overall energy levels.',
          category: 'Nutrition',
          priority: 3,
          isActive: true
        },
        {
          title: 'Importance of 7-8 Hours of Sleep',
          description: 'Sleep is critical for cognitive function, immune health, muscle recovery, and regulating mood and stress hormones.',
          category: 'Sleep',
          priority: 3,
          isActive: true
        },
        {
          title: 'Daily Exercise Boosts Brain Power',
          description: 'Just 30 minutes of moderate physical activity, like brisk walking, improves cardiovascular health and releases mood-boosting endorphins.',
          category: 'Exercise',
          priority: 2,
          isActive: true
        },
        {
          title: 'Manage Daily Stress with Mindfulness',
          description: 'Taking 5-10 minutes for deep breathing exercises, meditation, or quiet reflection can help reduce heart rate and lower cortisol levels.',
          category: 'Mental Health',
          priority: 2,
          isActive: true
        },
        {
          title: 'Regular Handwashing Prevents Infection',
          description: 'Washing your hands thoroughly with soap for at least 20 seconds is the single most effective way to prevent the spread of cold, flu, and other viruses.',
          category: 'Prevention',
          priority: 3,
          isActive: true
        }
      ];
      await HealthTip.insertMany(tipsData);
      console.log('Health tips seeded.');
    }

    console.log('Database verification and seeding completed successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
  }
};
