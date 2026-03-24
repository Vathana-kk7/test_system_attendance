import { PieChart, pieArcLabelClasses } from '@mui/x-charts/PieChart';

const data = [
  { label: 'PHP-LARAVEL', value: 1, color: '#0088FE' },
  { label: 'C++', value: 2, color: '#00C49F' },
  { label: 'REACT', value: 3, color: '#FFBB28' },
  { label: 'JAVA', value: 4, color: '#FF8042' },
];

const sizing = {
  margin: { right: 5 },
  width: 200,
  height: 200,
  hideLegend: true,
};
const TOTAL = data.map((item) => item.value).reduce((a, b) => a + b, 0);

const getArcLabel = (params) => {
  const percent = params.value / TOTAL;
  return `${(percent * 100).toFixed(0)}%`;
};

export default function ClassChart() {
  return (
    <div className="flex justify-center items-center transform transition-all duration-800 hover:scale-105">

    <PieChart
      series={[
          {
              outerRadius: 80,
              data,
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
              '0%': {
                opacity: 0,
                transform: 'scale(0)',
              },
              '100%': {
                opacity: 1,
                transform: 'scale(1)',
              },
            },
        }}
        {...sizing}
        />
        </div>
  );
}