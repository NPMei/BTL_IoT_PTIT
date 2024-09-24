import React from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import { blue, green, pink, purple, teal, deepOrange, grey } from '@mui/material/colors';

const profileData = [
  {
    name: 'Nguyễn Phương Mai',
    email: 'mainp1483@gmail.com',
    phone: '0332314773',
    bio: 'Hiện đang là sinh viên ngành An toàn thông tin tại Học viện Công nghệ Bưu chính Viễn thông',
    facebook: 'https://github.com/NPMei',
    avatar: '/assets/images/avatars/avatar_26.jpg',
  },
  {
    name: 'Đặng Quý Nam',
    email: 'dangnam.work.study@gmail.com',
    phone: '0353725403',
    bio: 'Hiện đang là sinh viên ngành An toàn thông tin tại Học viện Công nghệ Bưu chính Viễn thông',
    facebook: 'https://github.com/dnamgithub33',
    avatar: '/assets/images/avatars/avatar_27.jpg',
  },
];

const colors = [blue[50], green[50], pink[50], purple[50]];

export default function ProfilePage() {
  return (
    <Container>
      <Box mt={1}> {/* Giảm margin-top để đưa hồ sơ lên cao hơn */}
        <Grid container spacing={1}>
          {profileData.map((profile, index) => (
            <Grid item xs={12} md={6} key={index}>
              <Paper
                elevation={3}
                sx={{
                  padding: 3,
                  textAlign: 'center',
                  borderRadius: 2,
                  backgroundColor: colors[index % colors.length],
                  boxShadow: `0 4px 8px rgba(0, 0, 0, 0.2)`,
                }}
              >
                <Typography variant="h5" gutterBottom sx={{ color: 'text.primary' }}>
                  Hồ Sơ Cá Nhân {index + 1}
                </Typography>
                <Avatar
                  src={profile.avatar}
                  alt="Profile"
                  sx={{
                    width: 120,
                    height: 120,
                    borderRadius: '50%',
                    margin: '0 auto',
                    mb: 2,
                    border: `4px solid ${teal[300]}`,
                  }}
                />
                <Box>
                  <Typography variant="body1" gutterBottom sx={{ color: 'text.primary' }}>
                    <strong>Tên:</strong> {profile.name}
                  </Typography>
                  <Typography variant="body1" gutterBottom sx={{ color: 'text.primary' }}>
                    <strong>Email:</strong> {profile.email}
                  </Typography>
                  <Typography variant="body1" gutterBottom sx={{ color: 'text.primary' }}>
                    <strong>Số điện thoại:</strong> {profile.phone}
                  </Typography>
                  <Typography variant="body1" gutterBottom sx={{ color: 'text.primary' }}>
                    <strong>Giới thiệu:</strong> {profile.bio}
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    <strong>github:</strong> {profile.facebook && (
                      <a href={profile.facebook} target="_blank" rel="noopener noreferrer" style={{ color: deepOrange[800] }}>
                        {profile.facebook}
                      </a>
                    )}
                  </Typography>
                </Box>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Container>
  );
}
