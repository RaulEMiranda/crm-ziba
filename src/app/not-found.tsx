import Link from 'next/link';
import { Container, Typography, Button } from '@mui/material';

export default function NotFound() {
  return (
    <Container
      maxWidth="sm" // Define el ancho máximo del contenedor
      sx={{ textAlign: 'center', marginTop: '100px' }} // Estilos personalizados
    >
      <Typography variant="h2" component="h2" gutterBottom>
        Not Found
      </Typography>
      <Typography variant="body1" gutterBottom>
        Could not find requested resource
      </Typography>
      <Link href="/" passHref>
        <Button variant="contained" color="primary">
          Return Home
        </Button>
      </Link>
    </Container>
  );
}
