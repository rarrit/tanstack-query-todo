import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import axios from "axios";
import './App.css'
import { useState } from 'react';

const App = () => {
  const queryClient = useQueryClient();

  const [todoItem, setTodoItem] = useState("");

  const fetchTodos = async () => {
    // axios를 사용하여 json-server의 todos를 가져옴
    const response = await axios.get("http://localhost:4000/todos");
    return response.data;
  }
  
  const addTodo = async (newTodo) => {
    await axios.post("http://localhost:4000/todos", newTodo)
  }


  /* 
   * [1] useQuery는 두 개의 인자를 받음 
   * 리액트 쿼리가 자동으로 데이터의 종류를 queryKey로 캐싱함
   * useQuery로 호출한 데이터를 app.jsx에서쓰고있지만 A,B,C 컴포넌트에서 불러와도 DB까지안가고 캐싱되어 사용함
   * 리액트 쿼리에서 useQuery를 쓰는 중요한 개념임
  */

  const { data: todos , isPending, isError } = useQuery({      
      queryKey: ["todos"], // 배열로 받음
      queryFn:fetchTodos // 비동기 함수
  });

  const mutation = useMutation({
    mutationFn: addTodo,
    onSuccess: () => {
      // 첫 번째 인자에 query key가 들어가면 됌
      queryClient.invalidateQueries(["todos"]);
    }
  });

  if(isPending) {
    return <div>로딩중입니다...</div>
  }

  if(isError) {
    return <div>데이터 조회 중 오류가 발생했습니다...</div>
  }

  console.log("data", todos);
  
  return (
    <>
      <h1>Tanstack Query TodoList</h1>
      <form onSubmit={(e) => {
        e.preventDefault();

        // useMutation 로직 필요
        mutation.mutate({
          title: todoItem,
          isDone: false
        })
      }}>
        <input 
          type="text" 
          value={todoItem}
          onChange={(e) => setTodoItem(e.target.value)}
        />
        <button>추가</button>
        <ul>
          {
            todos.map(todo => {
              return (
                <li 
                  key={todo.id} 
                  style={{ 
                    display: "flex", 
                    alignItems: "center",
                    gap: "10px",                  
                  }}
                >
                  <h4>{todo.title}</h4>
                  <p>{todo.isDone ? "Done" : "Not Done"}</p>
                </li>
              )
            })
          }
        </ul>
      </form>      
    </>
  )
}

export default App
