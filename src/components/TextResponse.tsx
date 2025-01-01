
interface TextResponseProps {
  response: string
}

const TextResponse: React.FC<TextResponseProps> = ({ response }) =>
(
  <div className="response-section">
    <h3>Response:</h3>
    <p>{response}</p>
  </div>
);

export default TextResponse
