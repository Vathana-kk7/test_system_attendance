import * as React from 'react';
import Typography from '@mui/material/Typography';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';

export default function PaginationControlled({ page, setPage, total }) {
  const handleChange = (event, value) => {
    setPage(value);
  };

  return (
    <Stack spacing={2} className="flex items-center mt-4">
      <Pagination count={total} page={page} onChange={handleChange} />
    </Stack>
  );
}
