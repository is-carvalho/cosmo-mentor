import React, { useEffect, useState } from 'react';
// import HorizontalTimeline from 'react-horizontal-timeline';
import CodeEditor from '@uiw/react-textarea-code-editor';
import api from '../../services/api';

export default function CodeModal(Props) {
  const [code, setCode] = useState(Props.codigo);
  // const [emotion, setEmotion] = useState(Props.emotion);

  const fetchEmotionsOnQuestions = (questao_id) => {
    const response = api
      .get('/log/emotionsOnQuestions', {
        headers: {
          userid: Props.user.id,
          questao_id: questao_id,
        },
      })
      .then((res) => {
        console.log(res);
        return res.data;
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    // fetchEmotionsOnQuestions(Props.key);
    // console.log(Props.submission);
  });
  return (
    <>
      <div
        className='container'
        role='dialog'
      >
        <div
          className='modal-dialog modal-dialog-centered modal-lg'
          role='document'
        >
          <div className='modal-content'>
            <div className='modal-header'>
              <h5
                className='modal-title'
                id='exampleModalCenterTitle'
              >
                Codigo
                {fetchEmotionsOnQuestions(Props.submission) ? (
                  <h5>
                    Emoção Predominante :{' '}
                    {fetchEmotionsOnQuestions(Props.submission)}
                  </h5>
                ) : (
                  <></>
                )}
              </h5>

              <button
                type='button'
                className='close'
                data-dismiss='modal'
                aria-label='Close'
              >
                <span aria-hidden='true'>&times;</span>
              </button>
            </div>
            <div className='modal-body'>
              {/* {Props.codigo} */}
              <CodeEditor
                value={code}
                language='python'
                placeholder='Placeholder Text'
                onChange={(evn) => setCode(evn.target.value)}
                padding={15}
                style={{
                  fontSize: 14,
                  backgroundColor: '#fafafa',
                  fontFamily:
                    'ui-monospace,SFMono-Regular,SF Mono,Consolas,Liberation Mono,Menlo,monospace',
                }}
              />
              {/* <div className='chart-area'>
                <canvas id='chartBig1'></canvas>
              </div> */}
            </div>
            <div className='modal-footer'>
              <button
                type='button'
                className='btn btn-secondary'
                data-dismiss='modal'
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
