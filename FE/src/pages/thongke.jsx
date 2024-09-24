import { Helmet } from 'react-helmet-async';

import { ThongkeView } from 'src/sections/thongke/view'

// ----------------------------------------------------------------------

export default function ThongkePage() {
  return (
    <>
      <Helmet>
        <title> History| Minimal UI </title>
      </Helmet>

      <ThongkeView />
    </>
  );
}
