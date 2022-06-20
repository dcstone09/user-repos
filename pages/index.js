import { useCallback, useEffect, useState } from "react";
import {
  Typography,
  TableBody,
  TableCell,
  TableRow,
  TableHead,
  TableContainer,
  Paper,
  TextField,
  Stack,
  Container,
  Table,
  Autocomplete,
} from "@mui/material";

import debounce from "lodash.debounce";

const useUsers = (username) => {
  const [isLoading, setIsLoading] = useState(false);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    if (username) {
      const controller = new AbortController();
      const signal = controller.signal;
      setIsLoading(true);
      fetch(`https://api.github.com/search/users?q=${username}`, { signal })
        .then((res) => res.json())
        .then((data) => setUsers(data?.items || []))
        .catch((err) => console.log(err))
        .finally(() => setIsLoading(false));

      return () => {
        controller.abort();
      };
    }
  }, [username]);

  return {
    users,
  };
};

const useRepos = (username) => {
  const [isLoading, setIsLoading] = useState(false);
  const [repos, setRepos] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    setIsLoading(true);
    fetch(`https://api.github.com/users/${username}/repos`, { signal })
      .then((res) => res.json())
      .then((data) => setRepos(data))
      .catch((err) => setError(err))
      .finally(() => setIsLoading(false));

    return () => {
      controller.abort();
    };
  }, [username]);

  return {
    isLoading,
    error,
    repos,
  };
};

export default function Home() {
  const [username, setUsername] = useState();
  const [selectedUser, setSelectedUser] = useState();
  const { users } = useUsers(username);
  const { repos } = useRepos(selectedUser);

  const handleUsername = (event) => {
    setUsername(event.target.value);
  };
  const handleUserSearch = useCallback(debounce(handleUsername, 300), []);

  return (
    <>
      <Container maxWidth="lg">
        <Typography variant="h1" component="div" gutterBottom mt={2}>
          GitHub Repos
        </Typography>
        <Stack spacing={2}>
          <Autocomplete
            freeSolo
            onChange={(event, value) => setSelectedUser(value)}
            options={users.map((option) => option.login)}
            renderInput={(params) => (
              <TextField
                {...params}
                onChange={handleUserSearch}
                label="Search User"
                data-cy="user-search"
              />
            )}
          />
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Star Gazers</TableCell>
                  <TableCell>Watchers</TableCell>
                  <TableCell>Open Issues</TableCell>
                  <TableCell>Forks</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {repos.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell>{row.name}</TableCell>
                    <TableCell>{row.stargazers_count}</TableCell>
                    <TableCell>{row.watchers_count}</TableCell>
                    <TableCell>{row.open_issues_count}</TableCell>
                    <TableCell>{row.forks_count}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Stack>
      </Container>
    </>
  );
}
