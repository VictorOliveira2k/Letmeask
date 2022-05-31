import { useHistory, useParams  } from 'react-router-dom'

import toast from 'react-hot-toast'
import logoImg from '../assets/images/logo.svg'
import deleteImg from '../assets/images/delete.svg'
import checkImg from '../assets/images/check.svg'
import answerImg from '../assets/images/answer.svg'

// import '../styles/response'
import { Button } from '../components/Button'
import { Question } from '../components/Question'
import { RoomCode } from '../components/RoomCode'
import { Response } from '../components/Response'
import { useRoom } from '../hooks/useRoom'
import '../styles/room.scss'
import { database } from '../services/firebase'
import { useAuth } from '../hooks/useAuth'
import { useState, FormEvent } from 'react'





type RoomParams = {
  id: string;
}

export function AdminRoom() {
  const {user} = useAuth()
  const history = useHistory()
  const [ newResponse, setNewResponse] = useState('')
  const params = useParams<RoomParams>()
  const roomId = params.id

  const { title, questions } = useRoom(roomId)

  async function handleEndRoom(){
    database.ref(`rooms/${roomId}`).update({
      endedAt: new Date()
    })

    history.push("/")
  }
  
  async function handleCheckQuestionAsAnswered(questionId: string){
    await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
      isAnswered: true
    })
  }

  async function handleHighlightQuestion(questionId: string){
    await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
      isHighlighted: true
    })
  }

  async function handleDeleteQuestion(questionId: string ) {
    if (window.confirm("Tem certeza que você deseja excluir essa pergunta?")) {
      const questionRef = await database.ref(`rooms/${roomId}/questions/${questionId}`).remove()
    }
  }

  async function handleSendResponse(event: FormEvent){
    event.preventDefault()

    if (newResponse.trim() === ''){
      return
    }

    if(!user){
      toast.error("This didn't work.")
    }

    const response = {
      content: newResponse,
      author: {
        name: user?.name,
        avatar: user?.avatar,
      },
      isHighlighted: false,
      isAnswered: false,
    }
  
    await database.ref(`rooms/${roomId}/questions`).push(response)
    
    setNewResponse('')
  }

  return (
    <div id="page-room">
      <header>
        <div className="content">
          <img src={logoImg} alt="Letmeask" />
          <div>
            <RoomCode code={roomId}/>
            <Button isOutlined onClick={handleEndRoom}>Encerrar sala</Button>
          </div>
        </div>
      </header>
      <main className="content">
        <div className="room-title">
          <h1>Sala {title}</h1>
          { questions.length > 0 && <span>{questions.length} pergunta(s)</span>}
        </div>

        <div className="question-list">
          {questions.map(question => {
            return (
              
              <>
                <Question
                key={question.id}
                content={question.content}
                author={question.author}
                isAnswered={question.isAnswered}
                isHighlighted={question.isHighlighted}

              >
                <div>
                  <form action="" placeholder="escreva sua resposta"></form>
                  {!question.isAnswered && (
                    <>
                      <button
                        type="button"
                        onClick={() => handleCheckQuestionAsAnswered(question.id)}
                      >
                        <img src={checkImg} alt="Marcar pergunta como respondida" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleHighlightQuestion(question.id)}
                      >
                        <img src={answerImg} alt="Destacar pergunta" />
                      </button>
                    </>
                 )}
                  <button
                    type="button"
                    onClick={() => handleDeleteQuestion(question.id)}
                  >
                    <img src={deleteImg} alt="Remover pergunta" />
                  </button>
                </div>


                  <form 
                    className="response"
                    onSubmit={handleSendResponse}>
                    <textarea 
                      placeholder="Digite sua resposta"
                      onChange={event => setNewResponse(event.target.value)}
                      value={newResponse}
                    ></textarea>
                    
                    <div className='form-footer'>
                      { user ? (
                        <div className="user-info">
                          <img src={user.avatar} alt={user.name} />
                          <span>{user.name}</span>
                        </div>
                      ) : (
                        <span>Para enviar uma pergunta, <button>faça seu login</button>.</span>
                      ) }
                      <Button 
                        type="submit"
                        disabled={!user}
                      >Enviar resposta</Button>
                    </div>
                  </form>
                

              </Question>
              
              </>
              
            )
            
          })}
        </div>
      </main>

    </div>
  )
}