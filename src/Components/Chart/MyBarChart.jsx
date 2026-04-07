import { useState, useEffect } from 'react';
import { BarChart } from '@mui/x-charts/BarChart';
import Box from '@mui/material/Box';
import api from '../API/api.jsx';

export default function MyBarChart() {
  const [chartData, setChartData] = useState({
    presentData: [0, 0, 0, 0, 0, 0, 0],
    absentData: [0, 0, 0, 0, 0, 0, 0],
    permissionData: [0, 0, 0, 0, 0, 0, 0],
    xLabels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  });

  useEffect(() => {
    const fetchChartData = async () => {
      try {
        const res = await api.get("/api/attendance");
        const records = res.data;

        const xLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        
        const last7Days = [];
        for (let i = 6; i >= 0; i--) {
          const date = new Date();
          date.setDate(date.getDate() - i);
          last7Days.push(date.toISOString().split('T')[0]);
        }

        const presentData = last7Days.map(date => 
          records.filter(r => r.date === date && r.status === 'present').length
        );
        const absentData = last7Days.map(date => 
          records.filter(r => r.date === date && r.status === 'absent').length
        );
        const permissionData = last7Days.map(date => 
          records.filter(r => r.date === date && r.status === 'permission').length
        );

        setChartData({ presentData, absentData, permissionData, xLabels });
      } catch (error) {
        console.log(error);
      }
    };

    fetchChartData();
  }, []);

  return (
    <Box sx={{ width: '100%', height: 300 }}>
      <BarChart
        series={[
          {
            data: chartData.absentData,
            label: 'Absent',
            id: 'absentId',
            yAxisId: 'leftAxisId',
            color: '#dc3545',
          },
          {
            data: chartData.permissionData,
            label: 'Permission',
            id: 'permissionId',
            yAxisId: 'leftAxisId',
            color: '#F0AD4E',
          },
          {
            data: chartData.presentData,
            label: 'Present',
            id: 'presentId',
            yAxisId: 'rightAxisId',
            color: ' #2ECC71',
          },
        ]}
        xAxis={[{ data: chartData.xLabels, height: 28 }]}
        yAxis={[
          { id: 'leftAxisId', width: 50 },
          { id: 'rightAxisId', position: 'right' },
        ]}
        slotProps={{
          legend: { hidden: false },
        }}
        sx={{
          animation: 'none',
          '& .MuiBarElement-root': {
            animationDuration: '1s',
            animation: 'grow 1s ease-in-out',
          },
          '@keyframes grow': {
            '0%': {
              opacity: 0,
              transform: 'scaleY(0)',
            },
            '100%': {
              opacity: 1,
              transform: 'scaleY(1)',
            },
          },
        }}
      />
    </Box>
  );
}