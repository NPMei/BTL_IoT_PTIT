import SvgColor from 'src/components/svg-color';

// ----------------------------------------------------------------------

const icon = (name) => (
  <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />
);

const navConfig = [
  {
    title: 'Trang chủ',
    path: '/',
    icon: icon('ic_analytics'),
  },
  {
    title: 'Quản lý thiết bị',
    path: '/device/home/',
    icon: icon('ic_lock'),
  },
  {
    title: 'Lịch sử',
    path: '/thongke/',
    icon: icon('ic_blog'),
  },
  {
    title: 'Hồ sơ',
    path: '/profile/',
    icon: icon('ic_user'),
  },

];

export default navConfig;
