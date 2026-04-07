import api from '../Components/API/api.jsx';

const ReportStatistics = async () => {
  try {
    const res = await api.get("/api/attendance");
    const records = res.data;
    
    const totalRecords = records.length;
    const presentRecords = records.filter(r => r.status === 'present').length;
    const overallRate = totalRecords > 0 ? Math.round((presentRecords / totalRecords) * 100) : 0;
    
    return {
      overallRate: `${overallRate}%`,
      presentRecords: presentRecords,
      totalRecords: totalRecords
    };
  } catch (error) {
    console.log(error);
    return {
      overallRate: "0%",
      presentRecords: 0,
      totalRecords: 0
    };
  }
};
export default ReportStatistics;
