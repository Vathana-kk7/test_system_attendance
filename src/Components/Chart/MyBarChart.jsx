import { BarChart } from '@mui/x-charts/BarChart';
import Box from '@mui/material/Box';

// present (shows across week)
const presentData = [4, 3, 2, 2, 1, 2, 3];
// absent (example values; original 'pv')
const absentData = [1, 2, 9, 3, 4, 3, 4];
// permission — example values for every day (so all three columns appear each day)
const permissionData = [1, 12, 1, 9, 8, 1, 1];

const xLabels = [
  'Mon',
  'Tue',
  'Wed',
  'Thu',
  'Fri',
  'Sat',
  'Sun',
];

export default function MyBarChart() {
  return (
    <Box sx={{ width: '100%', height: 300 }}>
      <BarChart
        series={[
          {
            data: absentData,
            label: 'Absent',
            id: 'absentId',
            yAxisId: 'leftAxisId',
            color: '#dc3545',
          },
          {
            data: permissionData,
            label: 'Permission',
            id: 'permissionId',
            yAxisId: 'leftAxisId',
            color: '#F0AD4E',
          },
          {
            data: presentData,
            label: 'Present',
            id: 'presentId',
            yAxisId: 'rightAxisId',
            color: ' #2ECC71',
          },
        ]}
        xAxis={[{ data: xLabels, height: 28 }]}
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