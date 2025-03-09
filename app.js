const CountdownTimer = () => {
    const [targetDate, setTargetDate] = React.useState(new Date());
    const [remainingTime, setRemainingTime] = React.useState({
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      totalSeconds: 0
    });
    const [isRunning, setIsRunning] = React.useState(false);
    const [inputDateTime, setInputDateTime] = React.useState('');
    const [totalSeconds, setTotalSeconds] = React.useState(0);
    const [theme] = React.useState('dark'); // 'dark' or 'light'
  
    // 残り時間を計算
    const calculateTimeRemaining = () => {
      const now = new Date();
      const difference = targetDate - now;
  
      if (difference <= 0) {
        setIsRunning(false);
        playAlarmSound();
        return {
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
          totalSeconds: 0
        };
      }
  
      const totalSecondsRemaining = Math.floor(difference / 1000);
      
      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
        totalSeconds: totalSecondsRemaining
      };
    };
  
    React.useEffect(() => {
      let timer = null;
      
      if (isRunning) {
        timer = setInterval(() => {
          const timeRemaining = calculateTimeRemaining();
          setRemainingTime(timeRemaining);
          
          if (timeRemaining.totalSeconds <= 0) {
            clearInterval(timer);
            setIsRunning(false);
          }
        }, 1000);
      }
      
      return () => {
        if (timer) clearInterval(timer);
      };
    }, [isRunning, targetDate]);
  
    const startTimer = () => {
      if (!isRunning) {
        const timeRemaining = calculateTimeRemaining();
        setRemainingTime(timeRemaining);
        setTotalSeconds(timeRemaining.totalSeconds);
        setIsRunning(true);
      }
    };
  
    const resetTimer = () => {
      setIsRunning(false);
      const timeRemaining = calculateTimeRemaining();
      setRemainingTime(timeRemaining);
      setTotalSeconds(timeRemaining.totalSeconds);
    };
  
    const setCustomDateTime = () => {
      try {
        const newTargetDate = new Date(inputDateTime);
        
        // 過去の日時かチェック
        if (newTargetDate <= new Date()) {
          alert('未来の日時を指定してください');
          return;
        }
        
        setTargetDate(newTargetDate);
        setIsRunning(false);
        
        const timeRemaining = calculateTimeRemaining();
        setRemainingTime(timeRemaining);
        setTotalSeconds(timeRemaining.totalSeconds);
      } catch (error) {
        alert('有効な日時を入力してください');
      }
    };
    
    const playAlarmSound = () => {
      alert(`時間になりました！`);
    };
  
    // Calculate progress percentage
    const progressPercentage = remainingTime.totalSeconds && totalSeconds 
      ? (remainingTime.totalSeconds / totalSeconds) * 100
      : 100;
    
    // Calculate color based on remaining time
    const getAccentColor = () => {
      if (!totalSeconds) return '#6d28d9'; // Purple default
      
      const percentage = remainingTime.totalSeconds / totalSeconds;
      if (percentage > 0.6) return '#6d28d9'; // Purple
      if (percentage > 0.3) return '#7c3aed'; // Lighter purple
      return '#9333ea'; // Vibrant purple
    };
  
    // 日付フォーマット
    const formatDateForDisplay = (date) => {
      return date.toLocaleString('ja-JP', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    };
  
    // 背景のグラデーションスタイル
    const backgroundStyle = {
      background: theme === 'dark' 
        ? 'linear-gradient(135deg, #1e1e2f 0%, #2d3748 100%)' 
        : 'linear-gradient(135deg, #f0f4ff 0%, #e2e8f0 100%)',
      color: theme === 'dark' ? '#fff' : '#1a202c'
    };
  
    // 数字表示ブロックのスタイル
    const timeBlockStyle = {
      background: theme === 'dark' 
        ? 'rgba(26, 32, 44, 0.8)' 
        : 'rgba(255, 255, 255, 0.8)',
      boxShadow: theme === 'dark'
        ? '0 4px 6px rgba(0, 0, 0, 0.3), 0 1px 3px rgba(0, 0, 0, 0.2)'
        : '0 4px 6px rgba(0, 0, 0, 0.05), 0 1px 3px rgba(0, 0, 0, 0.1)',
      color: theme === 'dark' ? '#fff' : '#1a202c',
      borderRadius: '12px',
      padding: '12px 0',
      width: '100%'
    };
  
    return (
      <div className="flex flex-col items-center p-8 max-w-lg mx-auto rounded-xl shadow-2xl" style={backgroundStyle}>
        <h1 className="text-3xl font-bold mb-4" style={{
          background: `-webkit-linear-gradient(45deg, ${getAccentColor()}, #c084fc)`,
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          fontFamily: "'Montserrat', sans-serif"
        }}>カウントダウン</h1>
        
        {targetDate && (
          <div className="mb-6 text-lg opacity-80">
            {formatDateForDisplay(targetDate)}まで
          </div>
        )}
        
        {/* Digital Countdown Display */}
        <div className="grid grid-cols-4 gap-3 mb-8 text-center w-full">
          <div className="flex flex-col items-center">
            <div style={timeBlockStyle}>
              <div className="text-5xl font-mono font-bold transition-all duration-300" style={{
                color: getAccentColor(),
                textShadow: theme === 'dark' ? '0 0 10px rgba(109, 40, 217, 0.5)' : 'none'
              }}>
                {remainingTime.days}
              </div>
              <div className="text-xs mt-1 opacity-70">日</div>
            </div>
          </div>
          <div className="flex flex-col items-center">
            <div style={timeBlockStyle}>
              <div className="text-5xl font-mono font-bold transition-all duration-300" style={{
                color: getAccentColor(),
                textShadow: theme === 'dark' ? '0 0 10px rgba(109, 40, 217, 0.5)' : 'none'
              }}>
                {remainingTime.hours.toString().padStart(2, '0')}
              </div>
              <div className="text-xs mt-1 opacity-70">時間</div>
            </div>
          </div>
          <div className="flex flex-col items-center">
            <div style={timeBlockStyle}>
              <div className="text-5xl font-mono font-bold transition-all duration-300" style={{
                color: getAccentColor(),
                textShadow: theme === 'dark' ? '0 0 10px rgba(109, 40, 217, 0.5)' : 'none'
              }}>
                {remainingTime.minutes.toString().padStart(2, '0')}
              </div>
              <div className="text-xs mt-1 opacity-70">分</div>
            </div>
          </div>
          <div className="flex flex-col items-center">
            <div style={timeBlockStyle}>
              <div className="text-5xl font-mono font-bold transition-all duration-300" style={{
                color: getAccentColor(),
                textShadow: theme === 'dark' ? '0 0 10px rgba(109, 40, 217, 0.5)' : 'none'
              }}>
                {remainingTime.seconds.toString().padStart(2, '0')}
              </div>
              <div className="text-xs mt-1 opacity-70">秒</div>
            </div>
          </div>
        </div>
        
        {/* Visual Progress Indicator */}
        <div className="w-full h-3 bg-gray-700 bg-opacity-40 rounded-full mb-8 overflow-hidden">
          <div 
            className="h-full rounded-full transition-all duration-1000 ease-out"
            style={{ 
              width: `${progressPercentage}%`,
              background: `linear-gradient(90deg, ${getAccentColor()} 0%, #c084fc 100%)`
            }}
          />
        </div>
        
        {/* Timer Controls */}
        <div className="flex space-x-6 mb-8 justify-center">
          <button 
            onClick={startTimer} 
            disabled={isRunning}
            className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 ${
              isRunning 
                ? 'opacity-50 cursor-not-allowed' 
                : 'shadow-lg'
            }`}
            style={{
              background: 'linear-gradient(45deg, #6d28d9, #8b5cf6)',
              color: '#fff',
              minWidth: '120px'
            }}
          >
            {isRunning ? "実行中" : "スタート"}
          </button>
          <button 
            onClick={resetTimer}
            className="px-6 py-3 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 shadow-lg"
            style={{
              background: theme === 'dark'
                ? 'rgba(161, 98, 247, 0.2)'
                : 'rgba(161, 98, 247, 0.1)',
              border: '1px solid rgba(161, 98, 247, 0.5)',
              color: theme === 'dark' ? '#fff' : '#6d28d9',
              minWidth: '120px'
            }}
          >
            リセット
          </button>
        </div>
        
        {/* Date/Time Input */}
        <div className="w-full space-y-3 mb-2">        
          <div className="flex flex-col space-y-2">
            <label className="text-sm font-medium opacity-80">日時を指定:</label>
            <input
              type="datetime-local"
              value={inputDateTime}
              onChange={(e) => setInputDateTime(e.target.value)}
              className="p-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300"
              style={{
                background: theme === 'dark' 
                  ? 'rgba(26, 32, 44, 0.8)' 
                  : 'rgba(255, 255, 255, 0.8)',
                border: `1px solid ${getAccentColor()}`,
                color: theme === 'dark' ? '#fff' : '#1a202c',
              }}
            />
          </div>
  
          <button 
            onClick={setCustomDateTime}
            className="w-full px-4 py-3 rounded-lg font-medium mt-2 transition-all duration-300 transform hover:scale-105 shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
            style={{
              background: `linear-gradient(45deg, ${getAccentColor()}, #c084fc)`,
              color: '#fff',
            }}
          >
            日時を設定する
          </button>
        </div>
      </div>
    );
  };
  
  ReactDOM.render(<CountdownTimer />, document.getElementById('root'));