import { write } from '/js/operate.js'

const success = { error: false, content: '' };

// \n split
function splitLine(text) {
    const result = []
    const regex = new RegExp('\\\\n', 'g');
    let lastIndex = 0;
    let match;

    while ((match = regex.exec(text)) !== null) {
        result.push(text.substring(lastIndex, match.index));
        lastIndex = match.index + 2;
    }

    result.push(text.substring(lastIndex));
    return result;
}

function bothNumber(a, b) {
    return (a === 'Number' && b === 'Number');
}
function bothString(a, b) {
    return (a === 'String' && b === 'String');
}

export const funcs = {
    'assign': (ph, variables) => {
        if (ph.v2.type === 'Number') variables[ph.v1.value] = {value: Number(ph.v2.value), type: 'Number'};
        else if (ph.v2.type === 'String') variables[ph.v1.value] = {value: ph.v2.value, type: 'String'};
        return success;
    },
    'add_assign': (ph, variables) => {
        if (variables.hasOwnProperty(ph.v1.value)) {
            if (bothNumber(ph.v2.type, variables[ph.v1.value].type)) variables[ph.v1.value].value += Number(ph.v2.value);
            else if (bothString(ph.v2.type, variables[ph.v1.value].type)) variables[ph.v1.value].value += ph.v2.value;
            else return { error: true, content: `Error : 변수 ${ph.v1.value}에 ${ph.v2.value}을(를) 더할 수 없습니다.`};
            return success;
        } else {
            return { error: true, content: `Error : 변수 ${ph.v1.value}이(가) 정의되지 않았습니다.` }
        }
    },
    'subtract_assign': (ph, variables) => {
        if (variables.hasOwnProperty(ph.v1.value)) {
            if (bothNumber(ph.v2.type, variables[ph.v1.value].type)) variables[ph.v1.value].value -= Number(ph.v2.value);
            else return { error: true, content: `Error : 변수 ${ph.v1.value}에 ${ph.v2.value}을(를) 뺄 수 없습니다.`};
            return success;
        } else {
            return { error: true, content: `Error : 변수 ${ph.v1.value}이(가) 정의되지 않았습니다.` }
        }
    },
    'multiply_assign': (ph, variables) => {
        if (variables.hasOwnProperty(ph.v1.value)) {
            if (bothNumber(ph.v2.type, variables[ph.v1.value].type)) variables[ph.v1.value].value *= Number(ph.v2.value);
            else if (ph.v2.type === 'Number' && variables[ph.v1.value].type === 'String') variables[ph.v1.value].value = variables[ph.v1.value].value.repeat(Number(ph.v2.value));
            else return { error: true, content: `Error : 변수 ${ph.v1.value}에 ${ph.v2.value}을(를) 곱할 수 없습니다.`};
            return success;
        } else {
            return { error: true, content: `Error : 변수 ${ph.v1.value}이(가) 정의되지 않았습니다.` }
        }
    },
    'divide_assign': (ph, variables) => {
        if (variables.hasOwnProperty(ph.v1.value)) {
            if (bothNumber(ph.v2.type, variables[ph.v1.value].type)) variables[ph.v1.value].value /= Number(ph.v2.value);
            else return { error: true, content: `Error : 변수 ${ph.v1.value}에 ${ph.v2.value}을(를) 나눌 수 없습니다.`};
            return success;
        } else {
            return { error: true, content: `Error : 변수 ${ph.v1.value}이(가) 정의되지 않았습니다.` }
        }
    },
    'quotient_assign': (ph, variables) => {
        if (variables.hasOwnProperty(ph.v1.value)) {
            if (bothNumber(ph.v2.type, variables[ph.v1.value].type)) variables[ph.v1.value].value = Math.floor(variables[ph.v1.value].value / Number(ph.v2.value));
            else return { error: true, content: `Error : 변수 ${ph.v1.value}에 ${ph.v2.value}을(를) 나눌 수 없습니다.`};
            return success;
        } else {
            return { error: true, content: `Error : 변수 ${ph.v1.value}이(가) 정의되지 않았습니다.` }
        }
    },
    'remainder_assign': (ph, variables) => {
        if (variables.hasOwnProperty(ph.v1.value)) {
            if (bothNumber(ph.v2.type, variables[ph.v1.value].type)) variables[ph.v1.value].value %= Number(ph.v2.value);
            else return { error: true, content: `Error : 변수 ${ph.v1.value}에 ${ph.v2.value}을(를) 나눌 수 없습니다.`};
            return success;
        } else {
            return { error: true, content: `Error : 변수 ${ph.v1.value}이(가) 정의되지 않았습니다.` }
        }
    },
    'square_assign': (ph, variables) => {
        if (variables.hasOwnProperty(ph.v1.value)) {
            if (bothNumber(ph.v2.type, variables[ph.v1.value].type)) variables[ph.v1.value].value **= Number(ph.v2.value);
            else return { error: true, content: `Error : 변수 ${ph.v1.value}에 ${ph.v2.value}을(를) 제곱할 수 없습니다.`};
            return success;
        } else {
            return { error: true, content: `Error : 변수 ${ph.v1.value}이(가) 정의되지 않았습니다.` }
        }
    },
    'get_variable': (ph, variables) => {
        if (variables.hasOwnProperty(ph.v1.value)) {
            return { error: false, content: { type: variables[ph.v1.value].type, value: variables[ph.v1.value].value } }
        } else {
            return { error: true, content: `Error : 변수 ${ph.v1.value}이(가) 정의되지 않았습니다.` }
        }
    },
    'add': (ph, variables) => {
        if (bothNumber(ph.v1.type, ph.v2.type)) return { error: false, content: { type: 'Number', value: Number(ph.v1.value) + Number(ph.v2.value)}};
        else if (bothString(ph.v1.type, ph.v2.type)) return { error: false, content: { type: 'String', value: ph.v1.value + ph.v2.value}};
        else return { error: true, content: `Error : ${ph.v1.value}와(과) ${ph.v2.value}을(를) 더할 수 없습니다.` };
    },
    'subtract': (ph, variables) => {
        if (bothNumber(ph.v1.type, ph.v2.type)) return { error: false, content: { type: 'Number', value: Number(ph.v1.value) - Number(ph.v2.value)}};
        else return { error: true, content: `Error : ${ph.v1.value}와(과) ${ph.v2.value}을(를) 뺄 수 없습니다.` };
    },
    'multiply': (ph, variables) => {
        if (bothNumber(ph.v1.type, ph.v2.type)) return { error: false, content: { type: 'Number', value: Number(ph.v1.value) * Number(ph.v2.value)}};
        else if (ph.v1.type === 'Number' && ph.v2.type === 'String') return { error: false, content: { type: 'String', value: ph.v2.value.repeat(Number(ph.v1.value))}};
        else if (ph.v1.type === 'String' && ph.v2.type === 'Number') return { error: false, content: { type: 'String', value: ph.v1.value.repeat(Number(ph.v2.value))}};
        else return { error: true, content: `Error : ${ph.v1.value}와(과) ${ph.v2.value}을(를) 곱할 수 없습니다.` };
    },
    'divide': (ph, variables) => {
        if (bothNumber(ph.v1.type, ph.v2.type)) return { error: false, content: { type: 'Number', value: Number(ph.v1.value) / Number(ph.v2.value)}};
        else return { error: true, content: `Error : ${ph.v1.value}와(과) ${ph.v2.value}을(를) 나눌 수 없습니다.` };
    },
    'quotient': (ph, variables) => {
        if (bothNumber(ph.v1.type, ph.v2.type)) return { error: false, content: { type: 'Number', value: Math.floor(Number(ph.v1.value) / Number(ph.v2.value))}};
        else return { error: true, content: `Error : ${ph.v1.value}와(과) ${ph.v2.value}을(를) 나눌 수 없습니다.` };
    },
    'remainder': (ph, variables) => {
        if (bothNumber(ph.v1.type, ph.v2.type)) return { error: false, content: { type: 'Number', value: Number(ph.v1.value) % Number(ph.v2.value)}};
        else return { error: true, content: `Error : ${ph.v1.value}와(과) ${ph.v2.value}을(를) 나눌 수 없습니다.` };
    },
    'square': (ph, variables) => {
        if (bothNumber(ph.v1.type, ph.v2.type)) return { error: false, content: { type: 'Number', value: Number(ph.v1.value) ** Number(ph.v2.value)}};
        else return { error: true, content: `Error : ${ph.v1.value}와(과) ${ph.v2.value}을(를) 나눌 수 없습니다.` };
    },
    'equal': (ph, variables) => {
        if ((ph.v1.type === ph.v2.type) && (ph.v1.value === ph.v2.value)) return { error: false, content: { type: 'Bool', value: 'True' } };
        else return { error: false, content: { type: 'Bool', value: 'False' } };
    },
    'not_equal': (ph, variables) => {
        if ((ph.v1.type !== ph.v2.type) || (ph.v1.value !== ph.v2.value)) return { error: false, content: { type: 'Bool', value: 'True' } };
        else return { error: false, content: { type: 'Bool', value: 'False' } };
    },
    'print': (ph, variables)     => {
        const cnts = splitLine(ph.v1.value.toString());
        cnts.forEach((cnt) => {
            if (cnt === '') write(' ');
            else {
                const text = cnt.replaceAll('\\t', '    ');
                write(text);
            }
        })
        return success;
    }
}