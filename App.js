import React, {Component} from 'react';
import { 
  StyleSheet, 
  Text, 
  View,
  TouchableHighlight,
  ScrollView,
  Platform
} from 'react-native';
import formatTime from 'minutes-seconds-milliseconds';

export default class StopWatch extends Component{
  constructor(props) {
    super(props);
    this.state = {
      timeElapsed: null,
      running: false,
      startTime: null,
      laps: [],
    }
    this.handleLapPress = this.handleLapPress.bind(this);
    this.startButton = this.startButton.bind(this);
    this.handleStartPress = this.handleStartPress.bind(this);
    this.handleResetPress = this.handleResetPress.bind(this);
  }

  startButton() {
    let buttonStyle = this.state.running ? styles.stopButton : styles.startButton;
    let textStyle = this.state.running ? styles.stopText : styles.startText;

    return (
      <TouchableHighlight style={[styles.button, buttonStyle]} underlayColor="gray" onPress={this.handleStartPress}>
        <Text style={[styles.buttonText, textStyle]}>
          {this.state.running ? 'Stop' : 'Start'}
        </Text>
      </TouchableHighlight>
    )
  }

  lapButton() {
    return (
      <TouchableHighlight 
        style={[styles.button, styles.lapButton]} 
        underlayColor="rgba(255, 255, 255, 0.3)" 
        onPress={this.handleLapPress}>
        <Text style={[styles.buttonText, styles.lapText]}>Lap</Text>
      </TouchableHighlight>
    )
  }

  resetButton() {
    return (
      <TouchableHighlight 
        style={[styles.button, styles.resetButton]} 
        underlayColor="rgba(255, 214, 10, 0.3)" 
        onPress={this.handleResetPress}>
        <Text style={[styles.buttonText, styles.resetText]}>Reset</Text>
      </TouchableHighlight>
    )
  }

  handleStartPress() {
    if (this.state.running) {
      clearInterval(this.interval);
      this.setState({running: false});
      return;
    }

    this.setState({startTime: new Date() - this.state.timeElapsed});

    this.interval = setInterval(() => {
      this.setState({
        timeElapsed: new Date() - this.state.startTime,
        running: true
      });
    }, 30);
  }

  handleLapPress() {
    let lap = this.state.timeElapsed;

    this.setState({
      laps: this.state.laps.concat([lap])
    }); 
  }

  laps() {
  return this.state.laps.map(function(time, index) {
    return (
      <View key={index} style={styles.lapRow}>
        <Text style={styles.lapRowText}>Lap #{index + 1}</Text>
        <Text style={styles.lapRowText}>{formatTime(time)}</Text>
      </View>
    );
  });
}

  handleResetPress() {
    if (this.state.running) {
      this.handleStartPress();
    }

    this.setState({
      timeElapsed: null,
      running: false,
      startTime: null,
      laps: []
    })
  }

  render() {
    return (
      <View style={styles.container}>
        
        <View style={styles.header}>
          <View style={styles.timerWrapper}>
            <Text style={styles.timer}>
              {formatTime(this.state.timeElapsed)}
            </Text>
          </View>
          <View style={styles.buttonWrapper}>
            {this.startButton()}
            {this.lapButton()}
            {this.resetButton()}
          </View>
        </View>
        
        <ScrollView style={styles.footer}>
          {this.laps()}
        </ScrollView>

      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000', // Deep black background
    paddingHorizontal: 25,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
  },
  header: {
    flex: 0.5,
    justifyContent: 'center',
  },
  timerWrapper: {
    flex: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  timer: {
    fontSize: 84,
    fontWeight: '200', // Ultra-thin weights look more premium
    color: '#FFFFFF',
    fontVariant: ['tabular-nums'], // Prevents numbers from jumping around
    letterSpacing: -2,
  },
  buttonWrapper: {
    flex: 2,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 30,
  },
  button: {
    height: 80,
    width: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1, // Thinner borders look more modern
  },
  // Using translucent backgrounds for that "Apple" look
  startButton: {
    backgroundColor: 'rgba(45, 201, 110, 0.15)', // Very subtle green tint
    borderColor: '#32D74B', // Bright "Neon" Green
  },
  startText: {
    color: '#32D74B', // Matches the border
  },
  stopButton: {
    backgroundColor: 'rgba(255, 69, 58, 0.15)', // Very subtle red tint
    borderColor: '#FF453A', // Bright "System" Red
  },
  buttonText: {
    fontSize: 18,
    fontWeight: '500', // Slightly thicker text for readability
  },
  stopText: {
    color: '#FF453A', // Matches the border
  },
  footer: {
    flex: 3,
  },
  // Existing styles...
  lapButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderColor: '#FFFFFF',
  },
  lapText: {
    color: '#FFFFFF',
  },
  resetButton: {
    backgroundColor: 'rgba(255, 214, 10, 0.15)', // Subtle yellow tint
    borderColor: '#FFD60A', // Bright yellow
  },
  resetText: {
    color: '#FFD60A',
  },
  // Update your existing lapText to distinguish it from the button text
  lapRow: {
    flexDirection: 'row', 
    justifyContent: 'space-between', // Pushes text to the far left and far right
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#2C2C2E', // Subtle dark mode separator
  },
  lapRowText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '400',
    fontVariant: ['tabular-nums'], // Keeps the timer digits aligned
  },
});
