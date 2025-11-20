import { Card, CardContent, Typography } from '@mui/material';

interface MetricsCardProps {
  title: string;
  value: string;
  color: string;
}

function MetricsCard({ title, value, color }: MetricsCardProps) {
  return (
    <Card
      sx={{
        height: '100%',
        background: `linear-gradient(135deg, ${color}15 0%, ${color}05 100%)`,
        borderLeft: `4px solid ${color}`,
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 4,
        },
      }}
    >
      <CardContent>
        <Typography color="textSecondary" gutterBottom variant="body2">
          {title}
        </Typography>
        <Typography variant="h4" component="div" sx={{ color, fontWeight: 'bold' }}>
          {value}
        </Typography>
      </CardContent>
    </Card>
  );
}

export default MetricsCard;

