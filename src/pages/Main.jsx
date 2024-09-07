import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import axios from "axios";
import { useState } from 'react';
import { Link } from 'react-router-dom';

const Main = () => {
  // QueryClient를 사용해 캐시된 데이터를 업데이트하거나 무효화할 수 있습니다.
  const queryClient = useQueryClient();

  // Todo를 추가하기 위해 필요한 상태
  const [todoItem, setTodoItem] = useState("");

  // 수정할 Todo 항목을 관리하는 상태
  const [editTodo, setEditTodo] = useState(null);

  // Todos 데이터를 가져오는 비동기 함수
  const fetchTodos = async () => {
    const response = await axios.get("http://localhost:4000/todos");
    return response.data;
  }

  // 새로운 Todo를 추가하는 비동기 함수
  const addTodo = async (newTodo) => {
    await axios.post("http://localhost:4000/todos", newTodo);
  }

  // 기존 Todo를 업데이트하는 비동기 함수
  const updateTodo = async (updatedTodo) => {
    await axios.put(`http://localhost:4000/todos/${updatedTodo.id}`, updatedTodo);
  }

  // Todo를 삭제하는 비동기 함수
  const deleteTodo = async (id) => {
    await axios.delete(`http://localhost:4000/todos/${id}`);
  }

  // useQuery: Todo 리스트를 서버에서 가져와 캐싱하고 컴포넌트에서 사용할 수 있게 함
  const { data: todos, isPending, isError } = useQuery({
    queryKey: ["todos"],
    queryFn: fetchTodos,
    // select => 원하는 값을 변경하거나 추출할 때 사용함
    select: (todos) => {
      return todos.map((todo) => {
        return {...todo, test: 1};
      })
    }
  });
  console.log(todos);

  // useMutation: Todo를 추가하는 요청
  const addMutation = useMutation({
    mutationFn: addTodo,
    onSuccess: () => {
      queryClient.invalidateQueries(["todos"]); // 데이터를 새로고침
    }
  });

  // useMutation: Todo를 업데이트하는 요청
  const updateMutation = useMutation({
    mutationFn: updateTodo,
    onSuccess: () => {
      queryClient.invalidateQueries(["todos"]);
      setEditTodo(null); // 수정 상태를 초기화
    }
  });

  // useMutation: Todo를 삭제하는 요청
  const deleteMutation = useMutation({
    mutationFn: deleteTodo,
    onSuccess: () => {
      queryClient.invalidateQueries(["todos"]);
    }
  });

  if (isPending) {
    return <div>로딩중입니다...</div>
  }

  if (isError) {
    return <div>데이터 조회 중 오류가 발생했습니다...</div>
  }

  return (
    <>
      <h1>Tanstack Query TodoList</h1>
      <Link to={'/empty'}>
        <button type='button'>empty 페이지로 이동</button>
      </Link>
      <form onSubmit={(e) => {
        e.preventDefault();

        if (editTodo) {
          // 수정모드에서는 기존 Todo를 업데이트함
          updateMutation.mutate({
            ...editTodo,
            title: todoItem
          });
        } else {
          // 추가모드에서는 새로운 Todo를 추가함
          addMutation.mutate({
            title: todoItem,
            isDone: false
          });
        }

        setTodoItem("");
      }}>
        <input
          type="text"
          value={todoItem}
          onChange={(e) => setTodoItem(e.target.value)}
        />
        <button>{editTodo ? "수정" : "추가"}</button>
      </form>

      <ul>
        {todos.map(todo => (
          <li key={todo.id} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <h4>{todo.title}</h4>
            <p>{todo.isDone ? "Done" : "Not Done"}</p>
            <button onClick={() => deleteMutation.mutate(todo.id)}>삭제</button>
            <button onClick={() => {
              setTodoItem(todo.title);
              setEditTodo(todo); // 수정모드로 전환
            }}>수정</button>
          </li>
        ))}
      </ul>
    </>
  );
}

export default Main;