/* eslint-disable */

import React, { useState } from 'react';
import Container from '@mui/material/Container';
import { Box, IconButton, List, ListItem, ListItemText, Paper, TextField } from '@mui/material'; // eslint-disable-line perfectionist/sort-named-imports

import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import ReactTypingEffect from 'react-typing-effect'; // Asegúrate de instalar esta librería
import { Send } from '@mui/icons-material';

export default function HelpView() {
  const [historial, setHistorial] = useState([]);
  const [pregunta, setPregunta] = useState('');

  const procesarRespuesta = (respuesta) => {
    // eliminar la sección de citas
    const indexCitations = respuesta.indexOf('<citations>');
    if (indexCitations !== -1) {
      respuesta = respuesta.substring(0, indexCitations).trim();
    }

    // Opcional: Elimina caracteres de referencia como [^1.1.0]
    respuesta = respuesta.replace(/\[\^.*?\]/g, '');

    return respuesta;
  };

  const handleSendClick = async () => {
    if (pregunta.trim() === '') return;

    const nuevaPregunta = { tipo: 'pregunta', texto: pregunta };

    setHistorial((prevHistorial) => [...prevHistorial, nuevaPregunta]);

    try {
      const response = await fetch(
        'https://api.stack-ai.com/inference/v0/run/e5b03546-8d89-49c3-92f8-5af385fbd762/66f5ac8b920b2aa5274bb26e',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer 563769f1-0408-4543-9178-1be60f8cfac3',
          },
          body: JSON.stringify({ 
            'in-0': pregunta, 
            user_id: 'rubendotru@gmail.com' 
          }),
        }
      );

      const data = await response.json();
      const respuestaOriginal = data.outputs['out-0'];
      const respuestaProcesada = procesarRespuesta(respuestaOriginal);

      const nuevaRespuesta = { tipo: 'respuesta', texto: respuestaProcesada };

      setHistorial((prevHistorial) => [...prevHistorial, nuevaRespuesta]);
    } catch (error) {
      console.error('Error al obtener la respuesta de la API:', error);
      const errorRespuesta = {
        tipo: 'respuesta',
        texto: 'Hubo un error al obtener la respuesta. Por favor, inténtalo nuevamente.',
      };
      setHistorial((prevHistorial) => [...prevHistorial, errorRespuesta]);
    }

    setPregunta('');
  };

  return (
    <Container maxWidth="100%">
      <Typography variant="h4" sx={{ mb: 3 }}>
        Pregúntale a End-User Pro
      </Typography>

      <Paper sx={{ p: 2, borderRadius: '8px', height: '60vh', overflowY: 'auto' }}>
        <List>
          {historial.map((item, index) => (
            <ListItem
              key={index}
              sx={{ justifyContent: item.tipo === 'pregunta' ? 'flex-end' : 'flex-start' }}
            >
              <ListItemText
                primary={
                  item.tipo === 'respuesta' ? (
                    <ReactTypingEffect
                      text={item.texto}
                      speed={30}
                      eraseDelay={9999999}
                      typingDelay={0}
                      eraseSpeed={0}
                      cursor={' '}
                    />
                  ) : (
                    item.texto
                  )
                }
                primaryTypographyProps={{
                  align: item.tipo === 'pregunta' ? 'right' : 'left',
                  backgroundColor: item.tipo === 'pregunta' ? '#5B36F2' : '#ECF4F9',
                  color: item.tipo === 'pregunta' ? 'white' : 'textSecondary',
                  borderRadius: 1,
                  padding: 1.5,
                  width: 'fit-content',
                  maxWidth: '80%',
                  marginLeft: item.tipo === 'pregunta' ? 'auto' : 0,
                }}
              />
            </ListItem>
          ))}
        </List>
      </Paper>

      <Box display="flex" alignItems="center" marginTop={2} marginBottom={2}>
        <TextField
          name="text"
          placeholder="Pregúntale a End-User Pro"
          variant="outlined"
          value={pregunta}
          onChange={(e) => setPregunta(e.target.value)}
          sx={{
            backgroundColor: 'white',
            borderRadius: '50px',
            padding: '0px',
            width: '100%',
            '& .MuiOutlinedInput-root': {
              '& fieldset': {
                border: 'none',
              },
            },
          }}
          fullWidth
        />
        <IconButton onClick={handleSendClick}>
          <Send />
        </IconButton>
      </Box>
    </Container>
  );
}
