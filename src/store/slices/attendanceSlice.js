import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Generate dummy attendance data
const companies = ["THESAY", "SAYGEN", "warehouse", "farmassay"];
const employees = [
  "JITHIN", "FAWZY", "FAHEEM", "ASLAN", "ABHILASH", "AKSHAY", "VIJAY", "SUNEEL",
  "SUBHANI", "SENTHIL", "SHANOOB", "ILYAS", "SAFFY", "IFTIKAR", "PRASHANT",
  "SARUN", "CHENNAIA", "YAHYA", "MANOJ", "DEEPITA", "KSENIA", "SHOKHISTA", "AMINA"
];

const generateAttendanceRecords = () => {
  const records = [];
  const today = new Date();
  
  for (let i = 0; i < 85; i++) {
    const empIdx = i % employees.length;
    const companyIdx = i % companies.length;
    const daysAgo = Math.floor(Math.random() * 25);
    const recordDate = new Date(today);
    recordDate.setDate(today.getDate() - daysAgo);
    const dateStr = recordDate.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: '2-digit'
    }).replace(/\//g, '-');

    const hour = Math.floor(Math.random() * 2) + 7;
    const minute = Math.floor(Math.random() * 60);
    const punchInTime = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')} AM`;
    const isLate = (hour === 8 && minute > 30) || hour >= 9;

    let punchOut = "Not Punched Out";
    let hasPunchOut = false;
    if (Math.random() > 0.3) {
      const outHour = Math.floor(Math.random() * 3) + 16;
      const outMinute = Math.floor(Math.random() * 60);
      punchOut = `${outHour.toString().padStart(2, '0')}:${outMinute.toString().padStart(2, '0')} PM`;
      hasPunchOut = true;
    }

    records.push({
      id: i + 1,
      company: companies[companyIdx],
      employeeName: employees[empIdx],
      date: dateStr,
      punchIn: punchInTime,
      isLate: isLate,
      punchOut: punchOut,
      hasPunchOut: hasPunchOut
    });
  }
  
  records.sort((a, b) => {
    const dateA = a.date.split('-').reverse().join('-');
    const dateB = b.date.split('-').reverse().join('-');
    return dateB.localeCompare(dateA);
  });
  
  return records;
};

export const fetchAttendanceRecords = createAsyncThunk(
  'attendance/fetchAll',
  async () => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return generateAttendanceRecords();
  }
);

export const uploadAttendanceFile = createAsyncThunk(
  'attendance/upload',
  async (fileData) => {
    await new Promise(resolve => setTimeout(resolve, 1500));
    return fileData;
  }
);

const attendanceSlice = createSlice({
  name: 'attendance',
  initialState: {
    records: [],
    loading: false,
    error: null,
    totalCount: 0,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAttendanceRecords.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAttendanceRecords.fulfilled, (state, action) => {
        state.loading = false;
        state.records = action.payload;
        state.totalCount = action.payload.length;
      })
      .addCase(fetchAttendanceRecords.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(uploadAttendanceFile.fulfilled, (state, action) => {
        // In a real app, you would add the new records here
        console.log('File uploaded:', action.payload);
      });
  },
});

export default attendanceSlice.reducer;