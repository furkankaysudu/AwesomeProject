import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import axios from 'axios';
const App = () => {
  const [letters, setLetters] = useState([]);
  const [selectedLetters, setSelectedLetters] = useState([]);
  const baseUrl = "https://sozluk.gov.tr/gts?ara=";
  const [control, setControl] = useState(false);
  const [yanlisDeneme, setYanlisDeneme] = useState(0);


  useEffect(() => {
    // Türkçe alfabeden rastgele harfler seçin
    const alphabet = "ABCÇDEFGĞHIİJKLMNOÖPRSŞTUÜVYZ";
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
      'A': 1, 'B': 3, 'C': 4, 'Ç': 4, 'D': 3, 'E': 1, 'F': 7, 'G': 5,
      'Ğ': 8, 'H': 5, 'I': 2, 'İ': 2, 'J': 10, 'K': 1, 'L': 1, 'M': 2,
      'N': 1, 'O': 2, 'Ö': 7, 'P': 5, 'R': 1, 'S': 2, 'Ş': 4, 'T': 1,
      'U': 2, 'Ü': 3, 'V': 7, 'Y': 3, 'Z': 4,
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
      const res = await axios.get(baseUrl+word.toLowerCase())
      try {
        word === res.data[0].madde
          console.log("true")
          setPoint(point+calculatePoints(word))
          setSelectedLetters([]);
        } catch {
        console.log("false");
        setYanlisDeneme(yanlisDeneme+1)
        
        if (point!=0){setPoint(point-1)}
        
      }
    }
  }
  
  
  const handleClearButtonPress = () => {
    // Seçilen harfleri temizleyin
    setSelectedLetters([]);
  }
  const puanıSıfırla = () =>{
    setPoint(0)
    setYanlisDeneme(0)
  }

  const renderGrid = () => {
    const grid = [];
  
    // İlk 7 satırı boş bırakın
    for (let i = 0; i < 7; i++) {
      const emptyRow = [];
      for (let j = 0; j < 8; j++) {
        emptyRow.push(
          <View key={`empty-${i}-${j}`} style={styles.cell}></View>
        );
      }
      grid.push(
        <View key={i} style={styles.row}>
          {emptyRow}
        </View>
      );
    }
  
    // Son 3 satıra harfleri yerleştirin
    for (let i = 7; i < 10; i++) {
      const row = [];
      for (let j = 0; j < 8; j++) {
        const index = (i - 7) * 8 + j;
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
      <View style={styles.buttonViews}>
      
      <TouchableOpacity onPress={handleStartButtonPress} style={styles.button}>
        <Text style={styles.buttonText}>GÖNDER</Text>        
      </TouchableOpacity>
      
      <TouchableOpacity onPress={puanıSıfırla} style={styles.button}>
        <Text style={styles.buttonText}>SIFIRLA</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={handleClearButtonPress} style={styles.button}>
        <Text style={styles.buttonText}>TEMİZLE</Text>
      </TouchableOpacity>
      
      </View>
      <Text style={styles.selectedLetters}>HATA:{yanlisDeneme}</Text>
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
    marginTop:20,
    flex: 1,
    justifyContent: 'center',
    
    backgroundColor: '#fff',
  },
  buttonViews:{
    flexDirection:'row',
    justifyContent: 'space-around'
  }
  ,
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
    borderWidth: 1,
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
    marginVertical: 4,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
export default App;