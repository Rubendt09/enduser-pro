import { Helmet } from 'react-helmet-async';

import { HelpView } from 'src/sections/help';

// ----------------------------------------------------------------------

export default function HelpPage() {
  return (
    <>
      <Helmet>
        <title> Helper | End User </title>
      </Helmet>

      <HelpView />
    </>
  );
}
