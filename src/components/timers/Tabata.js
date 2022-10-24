import { useEffect, useState } from 'react';
import Button from '../generic/Button';
import Input from '../generic/Input';
import { translateFromSeconds, translateToSeconds } from '../../utils/helpers';

const Tabata = () => {

    // States for countdown
    const [isRunning, setIsRunning] = useState(false);
    const [isComplete, setIsComplete] = useState(true);
    const [inputIsDisabled, setInputIsDisabled] = useState(false);
    const [time, setTime] = useState(0);
    const [inputHours, setInputHours] = useState(0);
    const [inputMinutes, setInputMinutes] = useState(0);
    const [inputSeconds, setInputSeconds] = useState(0);
    const [inputTime, setInputTime] = useState(0);
    // States for rounds
    const [round, setRound] = useState(1);
    const [counterRound, setCounterRound] = useState(1);
    const [inputRounds, setInputRounds] = useState(1);
    // States for second countdown
    const [time2, setTime2] = useState(0);
    const [input2Hours, setInput2Hours] = useState(0);
    const [input2Minutes, setInput2Minutes] = useState(0);
    const [input2Seconds, setInput2Seconds] = useState(0);
    const [input2Time, setInput2Time] = useState(0);

    const handleClick = value => {
        if (value === "Start") {
            setIsRunning(true);
            setIsComplete(false);
            setInputIsDisabled(true);
        } else if (value === "Pause") {
            setIsRunning(false);
        } else if (value === "Resume") {
            setIsRunning(true);
        } else if (value === 'Fast Forward') {
            setTime(0);
            setTime2(0);
            setIsRunning(false);
            setIsComplete(true);
            setInputIsDisabled(false);
            setRound(inputRounds);
            setCounterRound(inputRounds);
        } else if (value === 'Reset') {
            setTime(inputTime);
            setTime2(input2Time);
            setIsComplete(true);
            setIsRunning(false);
            setInputIsDisabled(false);
            setRound(inputRounds);
            setCounterRound(1);
        }
    }

    const makeInput = (state, setter, relatedSetter) => {
        return <Input value={state} disabledValue={inputIsDisabled} onChange={e => {
            if (e.target.value) {
                setter(parseInt(e.target.value));
                relatedSetter(parseInt(e.target.value));
            } else {
                setter(0);
            }
        }} />
    };

    const makeButton = (value, disabledValue) => {
        return <Button value={value} disabledValue={disabledValue} inputTime={inputTime} onClick={handleClick} />
    };

    useEffect(() => {
        
        const totalSeconds = translateToSeconds(inputHours, inputMinutes, inputSeconds);
        setInputTime(totalSeconds);
        setTime(totalSeconds);

        const totalSeconds2 = translateToSeconds(input2Hours, input2Minutes, input2Seconds);
        setInput2Time(totalSeconds2);
        setTime2(totalSeconds2);

    }, [inputHours, inputMinutes, inputSeconds, input2Hours, input2Minutes, input2Seconds]);

    useEffect(() => {

        let i;
        let i2;

        if (isRunning) {
            i = setInterval(() => {
                setTime(time - 1);
            }, 1000);
            if (time == 0) {
                if (time2 !== 0) {
                    i2 = setInterval(() => {
                        setTime2(time2 - 1);
                    }, 1000);
                    clearInterval(i);
                } else if (round == 1) {
                    clearInterval(i);
                    clearInterval(i2);
                    setIsRunning(false);
                } else {
                    setTime(inputTime);
                    setTime2(input2Time);
                    setRound(round - 1);
                    setCounterRound(counterRound + 1);
                }
            }
        }

        return () => {
            clearInterval(i);
            clearInterval(i2);
        };

    }, [time, inputTime, isRunning, round, counterRound, time2, input2Time ]);

    return (
        <>
            <div>{translateFromSeconds(time)}</div>
            <div>{translateFromSeconds(time2)}</div>
            <div>Round: {counterRound} of {inputRounds}</div>
            Count down from
            <br></br>
            {makeInput(inputHours, setInputHours, setTime)} H
            {makeInput(inputMinutes, setInputMinutes, setTime)} M
            {makeInput(inputSeconds, setInputSeconds, setTime)} S
            <br></br>
            Then count down from
            <br></br>
            {makeInput(input2Hours, setInput2Hours, setTime2)} H
            {makeInput(input2Minutes, setInput2Minutes, setTime2)} M
            {makeInput(input2Seconds, setInput2Seconds, setTime2)} S
            <br></br>
            For {makeInput(inputRounds, setInputRounds, setRound)} rounds
            <br></br>
            {makeButton("Start", !isComplete || (time === 0))}
            {makeButton("Pause", !isRunning)}
            {makeButton("Resume", isRunning || isComplete || (time === 0 && time2 === 0))}
            {makeButton("Fast Forward", isComplete || (time === 0 && time2 === 0))}
            {makeButton("Reset", isComplete && (time === inputTime))}
        </>
    );
};

export default Tabata;
