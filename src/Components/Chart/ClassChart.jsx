import { PieChart, pieArcLabelClasses } from '@mui/x-charts/PieChart';
import { ClassCourse } from '../Dashboard/ClassCourse';
import { useEffect, useState } from 'react';

const sizing = {
  margin: { right: 5 },
  width: 200,
  height: 200,
  hideLegend: true,
};

export default function ClassChart() {
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const fetchCourses = async () => {
      const courses = await ClassCourse(); // API returns array of courses

      // Map API data: use course ID as value
      const formattedData = courses.map((c, idx) => ({
        label: c.name_course,
        value: c.id, // <-- use ID as value
        color: ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'][idx % 4],
      }));

      setChartData(formattedData);
    };

    fetchCourses();
  }, []);

  const TOTAL = chartData.reduce((sum, item) => sum + item.value, 0);

  const getArcLabel = (params) => {
    const percent = TOTAL ? params.value / TOTAL : 0;
    return `${(percent * 100).toFixed(0)}%`;
  };

  return (
    <div className="flex justify-center items-center transform transition-all duration-800 hover:scale-105">
      <PieChart
        series={[
          {
            outerRadius: 80,
            data: chartData,
            arcLabel: getArcLabel,
          },
        ]}
        sx={{
          [`& .${pieArcLabelClasses.root}`]: {
            fill: 'white',
            fontSize: 14,
          },
          '& .MuiPieArc-root': {
            animationDuration: '1s',
            animation: 'slideIn 1s ease-out',
          },
          '@keyframes slideIn': {
            '0%': { opacity: 0, transform: 'scale(0)' },
            '100%': { opacity: 1, transform: 'scale(1)' },
          },
        }}
        {...sizing}
      />
    </div>
  );
}