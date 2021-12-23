import React from 'react';
import './App.css';

import {
  useQuery,
  useMutation,
  useQueryClient,
  QueryClient,
  QueryClientProvider,
} from 'react-query'

// Create a client
const queryClient = new QueryClient()

function App() {
  return (
    // Provide the client to your App
    <QueryClientProvider client={queryClient}>
      <Todos />
    </QueryClientProvider>
  )
}


const getPosts = () => {
  return fetch('http://localhost:3000/posts')
    .then(response => response.json());
}
const addPost = (payload) => {
  return fetch('http://localhost:3000/posts', { method: 'POST', body: JSON.stringify(payload), headers: { 'Content-Type': 'application/json' } })
    .then(response => response.json());
};
const deletePost = (id) => {
  return fetch(`http://localhost:3000/posts/${id}/`, { method: 'DELETE' })
    .then(response => response.json());
};

function Todos() {
  // Access the client
  const queryClient = useQueryClient()

  // Queries
  const query = useQuery('posts', getPosts)

  // Mutations
  const deletetion = useMutation(deletePost, {
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries('posts')
    },
  });

  const mutation = useMutation(addPost, {
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries('posts')
    },
  });

  if (query.isLoading) return <h3>Loading</h3>;
  if (query.isError) return <h3>Error</h3>;

  return (
    <div>
      <h3>TODO APP1</h3>
      <ul>
        {query.data.map(todo => (
          <li key={todo.id}>
            <span style={{ marginRight: '10px' }}>{todo.title}</span>
            <button onClick={() => deletetion.mutate(todo.id)}>
              Delete
            </button>
          </li>
        ))}
      </ul>

      <button
        onClick={() => {
          mutation.mutate({
            title: `New react library ${Math.floor(Math.random() * 100) % 50}`,
            author: 'Test'
          })
        }}
      >
        Add Post
      </button>
    </div>
  )
}

export default App;
