import { useChat } from './hooks/useChat';
import { Login } from './components/Login';
import { ChatInterface } from './components/ChatInterface';

function App() {
  const { currentUser } = useChat();

  return (
    <div className="App">
      {!currentUser ? <Login /> : <ChatInterface />}
    </div>
  );
}

export default App;