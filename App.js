import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import axios from 'axios';
const App = () => {
  const [letters, setLetters] = useState([]);
  const [selectedLetters, setSelectedLetters] = useState([]);
  const baseUrl = "https://sozluk.gov.tr/gts?ara=";
  const [control, setControl] = useState(false);
  const kelimeDogru= '';


  useEffect(() => {
    // Türkçe alfabeden rastgele harfler seçin
    const alphabet = "abcçdefgğhıijklmnoöprsştuüvyz";
    const selectedLetters = [];
    for (let i = 0; i < 24; i++) {
      selectedLetters.push(alphabet[Math.floor(Math.random() * alphabet.length)]);
    }
    setLetters(selectedLetters);
  }, []);

  const handleLetterPress = (letter) => {
    // Seçilen harfi kontrol edin ve kelimeye ekleyin
    const newSelectedLetters = [...selectedLetters, letter];
    setSelectedLetters(newSelectedLetters);
  }
  const word = selectedLetters.join('');
  
  const [point, setPoint] = useState(0);
  function calculatePoints(kelime) {
    const scores = {
      'a': 1, 'b': 3, 'c': 4, 'ç': 4, 'd': 3, 'e': 1, 'f': 7, 'g': 5,
      'ğ': 8, 'h': 5, 'ı': 2, 'i': 2, 'j': 10, 'k': 1, 'l': 1, 'm': 2,
      'n': 1, 'o': 2, 'ö': 7, 'p': 5, 'r': 1, 's': 2, 'ş': 4, 't': 1,
      'u': 2, 'ü': 3, 'v': 7, 'y': 3, 'z': 4,
    };
    let point = 0;
    for (let i = 0; i < kelime.length; i++) {
      const letter = kelime[i];
      const score = scores[letter];
      point += score;
      setPoint(point)
    }
    console.log(point)
    
    return point;
  }
  

  const handleStartButtonPress = async () => {
    if(selectedLetters.length>2){
      const res = await axios.get(baseUrl+word)
      try {
        word === res.data[0].madde
          console.log("true")
          setPoint(point+calculatePoints(word))
          setSelectedLetters([]);
        } catch {
        console.log("false");
      }
    }
  }
  
  
  const handleClearButtonPress = () => {
    // Seçilen harfleri temizleyin
    setSelectedLetters([]);
  }
  const puanıSıfırla = () =>{
    setPoint(0)
  }

  const renderGrid = () => {
    const grid = [];
    for (let i = 0; i < 10; i++) {  // en alt üç satırı oluşturmak için değişiklik yaptık
      const row = [];
      for (let j = 0; j < 8; j++) {
        const index = i * 8 + j;
        row.push(
          <TouchableOpacity 
            key={index}
            onPress={() => handleLetterPress(letters[index])}
            style={styles.cell}
          >
            <Text style={styles.letter}>{letters[index]}</Text>
          </TouchableOpacity>
        );
      }
      grid.push(
        <View key={i} style={styles.row}>
          {row}
        </View>
      );
    }
    return (
      <>
        {grid}
        <TouchableOpacity onPress={handleStartButtonPress} style={styles.button}>
          <Text style={styles.buttonText}>GÖNDER</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={puanıSıfırla} style={styles.button}>
          <Text style={styles.buttonText}>SIFIRLA</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleClearButtonPress} style={styles.button}>
          <Text style={styles.buttonText}>TEMİZLE</Text>
        </TouchableOpacity>
      </>
    );
  }

  return (
    
    <View style={styles.container}>
      <View style={styles.bottomRow}>
        <Text style={styles.point}>{point } POINT </Text>
      </View>
      {renderGrid()}
      <View style={styles.bottomRow}>
        <Text style={styles.selectedLetters}>{selectedLetters.join("")}</Text>
      </View>
      <View style={styles.gridContainer}>
        
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    justifyContent:'center',
    width: '100%',
    paddingHorizontal: 20,
    marginTop: 20,
  },
  selectedLetters: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    
  },
  point: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  gridContainer: {
    marginTop: 30,
    flexDirection: 'column', // burası değiştirildi
    alignItems: 'center', // burası eklendi
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cell: {
    borderWidth: 2,
    borderColor: '#333',
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    
  },
  letter: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  button: {
    backgroundColor: '#333',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginVertical: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
export default App;