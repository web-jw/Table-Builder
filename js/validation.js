function prepArgsForValidation(args, types) {
    let listOfReadyArgs = [];
    for (let arg of [...args]) {
        const posInArgs = [...args].indexOf(arg);
        if (Object.prototype.toString.call(arg) === `[object Object]` && types[posInArgs] === undefined) {
            for (let key in arg) {
                if (!types[key] && !types.all)
                    console.error(`prepArgsForValidation(): Type of ${key} was not declared`);
                if (!Array.isArray((types[key] || types.all)))
                    console.error(`prepArgsForValidation(): Types of ${key} is not an ARRAY`);
                const newReadyArg = {
                    key,
                    value: arg[key],
                    types: (types[key] || types.all).map(type => type.replace(/^[a-z]/, (x) => x.toUpperCase()))
                };
                listOfReadyArgs = [...listOfReadyArgs, newReadyArg];
            }
        }
        else {
            if (!Array.isArray((types[posInArgs] || types.all)))
                console.error(`prepArgsForValidation(): Types of ${arg} is not an ARRAY`);
            if (!types[posInArgs] && !types.all)
                console.error(`prepArgsForValidation(): Type of ${arg} was not declared`);
            const newReadyArg = {
                key: posInArgs.toString(),
                value: arg,
                types: (types[posInArgs] || types.all).map(type => type.replace(/^[a-z]/, (x) => x.toUpperCase()))
            };
            listOfReadyArgs = [...listOfReadyArgs, newReadyArg];
        }
    }
    return listOfReadyArgs;
}
function validateArguments({ args, types }) {
    const argsReadyToValidate = prepArgsForValidation(args, types);
    const listOfErrors = argsReadyToValidate.map(arg => {
        const typeOfArg = Object.prototype.toString.call(arg.value);
        const isOneOfTheseTypes = (typeOfArg === `[object Object]` || typeOfArg === `[object String]` || typeOfArg === `[object Array]`);
        let isWrongType = true;
        for (let type of arg.types)
            if (typeOfArg === `[object ${type}]`)
                isWrongType = false;
        if (isWrongType)
            return `${arg.key}: Wrong type: ${typeOfArg} | Should be: ${arg.types.join(', ')}`;
        if (isOneOfTheseTypes && Object.keys(arg.value).length === 0)
            return `${arg.key}: Argument is EMPTY`;
    });
    const validationResult = listOfErrors.every(error => error === undefined);
    return (!validationResult) ? listOfErrors : false;
}
function displayErrorMessege({ nameOfFunction }, { validationResult }) {
    const validResult = validateArguments({ args: arguments, types: { nameOfFunction: ['string'], validationResult: ['array', 'boolean'] } });
    if (!!validResult)
        console.error(`displayErrorMessege(): ${validResult.filter(error => error !== undefined).join(' / ')}`);
    if (!!validationResult)
        console.error(`${nameOfFunction}(): ${validationResult.filter(error => error !== undefined).join(' / ')}`);
    return (!!validResult) ? false : true;
}
export default function argsValidation({ dataForValidation, nameOfFunction }) {
    const validationResult = validateArguments(dataForValidation);
    const errorMessege = displayErrorMessege({ nameOfFunction }, { validationResult });
    return errorMessege;
}
