/* *
 * This sample demonstrates handling intents from an Alexa skill using the Alexa Skills Kit SDK (v2).
 * Please visit https://alexa.design/cookbook for additional examples on implementing slots, dialog management,
 * session persistence, api calls, and more.
 * */
const Alexa = require('ask-sdk-core');
const i18n = require('i18next');
const sprintf = require('i18next-sprintf-postprocessor');

const languageStrings = {
    en: {
        translation: {
            WELCOME_MESSAGE: 'Welcome Rodrigo del noveno A, you can ask me to convert units. Which would you like to try?',
            HELP_MESSAGE: 'You can ask me to convert centimeters to meters or kilometers, and inches to yards or feet. How can I help?',
            GOODBYE_MESSAGE: 'Goodbye, Rodrigo del noveno A!',
            REFLECTOR_MESSAGE: 'You just triggered %s',
            FALLBACK_MESSAGE: 'Sorry, I don\'t know about that. Please try again.',
            ERROR_MESSAGE: 'Sorry, there was an error. Please try again.',
            CONVERT_MESSAGE: 'The conversion result is %s.'
        }
    },
    es: {
        translation: {
            WELCOME_MESSAGE: 'Bienvenido Rodrigo del noveno A, puedes pedirme que convierta unidades. ¿Qué te gustaría intentar?',
            HELP_MESSAGE: 'Puedes pedirme que convierta centímetros a metros o kilómetros, y pulgadas a yardas o pies. ¿Cómo te puedo ayudar?',
            GOODBYE_MESSAGE: '¡Adiós, Rodrigo del noveno A!',
            REFLECTOR_MESSAGE: 'Acabas de activar %s',
            FALLBACK_MESSAGE: 'Lo siento, no sé sobre eso. Por favor, inténtalo de nuevo.',
            ERROR_MESSAGE: 'Lo siento, hubo un error. Por favor, inténtalo de nuevo.',
            CONVERT_MESSAGE: 'El resultado de la conversión es %s.'
        }
    }
};

const unitConversions = {
    en: {
        inchToFeet: (value) => value / 12,
        inchToYard: (value) => value / 36,
        feetToInch: (value) => value * 12,
        feetToYard: (value) => value / 3,
        yardToInch: (value) => value * 36,
        yardToFeet: (value) => value * 3,
    },
    es: {
        cmToM: (value) => value / 100,
        cmToKm: (value) => value / 100000,
        mToCm: (value) => value * 100,
        mToKm: (value) => value / 1000,
        kmToCm: (value) => value * 100000,
        kmToM: (value) => value * 1000,
    }
};

const LaunchRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'LaunchRequest';
    },
    handle(handlerInput) {
        const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
        const speakOutput = requestAttributes.t('WELCOME_MESSAGE');

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

const ConvertIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'ConvertIntent';
    },
    handle(handlerInput) {
        const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
        const locale = handlerInput.requestEnvelope.request.locale.split('-')[0];
        const slots = handlerInput.requestEnvelope.request.intent.slots;

        const fromUnit = slots.fromUnit.value;
        const toUnit = slots.toUnit.value;
        const value = parseFloat(slots.value.value);

        let conversionResult;

        if (locale === 'es') {
            switch (fromUnit) {
                case 'centímetros':
                    if (toUnit === 'metros') {
                        conversionResult = unitConversions.es.cmToM(value);
                    } else if (toUnit === 'kilómetros') {
                        conversionResult = unitConversions.es.cmToKm(value);
                    }
                    break;
                case 'metros':
                    if (toUnit === 'centímetros') {
                        conversionResult = unitConversions.es.mToCm(value);
                    } else if (toUnit === 'kilómetros') {
                        conversionResult = unitConversions.es.mToKm(value);
                    }
                    break;
                case 'kilómetros':
                    if (toUnit === 'centímetros') {
                        conversionResult = unitConversions.es.kmToCm(value);
                    } else if (toUnit === 'metros') {
                        conversionResult = unitConversions.es.kmToM(value);
                    }
                    break;
            }
        } else if (locale === 'en') {
            switch (fromUnit) {
                case 'inches':
                    if (toUnit === 'feet') {
                        conversionResult = unitConversions.en.inchToFeet(value);
                    } else if (toUnit === 'yards') {
                        conversionResult = unitConversions.en.inchToYard(value);
                    }
                    break;
                case 'feet':
                    if (toUnit === 'inches') {
                        conversionResult = unitConversions.en.feetToInch(value);
                    } else if (toUnit === 'yards') {
                        conversionResult = unitConversions.en.feetToYard(value);
                    }
                    break;
                case 'yards':
                    if (toUnit === 'inches') {
                        conversionResult = unitConversions.en.yardToInch(value);
                    } else if (toUnit === 'feet') {
                        conversionResult = unitConversions.en.yardToFeet(value);
                    }
                    break;
            }
        }

        const speakOutput = requestAttributes.t('CONVERT_MESSAGE', conversionResult);
        const finalSpeakOut = `${speakOutput} ${toUnit}`

        return handlerInput.responseBuilder
            .speak(finalSpeakOut)
            .reprompt(finalSpeakOut)
            .getResponse();
    }
};

const HelpIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.HelpIntent';
    },
    handle(handlerInput) {
        const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
        const speakOutput = requestAttributes.t('HELP_MESSAGE');

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

const CancelAndStopIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && (Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.CancelIntent'
                || Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.StopIntent');
    },
    handle(handlerInput) {
        const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
        const speakOutput = requestAttributes.t('GOODBYE_MESSAGE');

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .getResponse();
    }
};

const FallbackIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.FallbackIntent';
    },
    handle(handlerInput) {
        const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
        const speakOutput = requestAttributes.t('FALLBACK_MESSAGE');

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

const SessionEndedRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'SessionEndedRequest';
    },
    handle(handlerInput) {
        console.log(`~~~~ Session ended: ${JSON.stringify(handlerInput.requestEnvelope)}`);
        return handlerInput.responseBuilder.getResponse();
    }
};

const IntentReflectorHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest';
    },
    handle(handlerInput) {
        const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
        const intentName = Alexa.getIntentName(handlerInput.requestEnvelope);
        const speakOutput = requestAttributes.t('REFLECTOR_MESSAGE', intentName);

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .getResponse();
    }
};

const ErrorHandler = {
    canHandle() {
        return true;
    },
    handle(handlerInput, error) {
        const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
        const speakOutput = requestAttributes.t('ERROR_MESSAGE');
        console.log(`~~~~ Error handled: ${JSON.stringify(error)}`);

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

const LoggingRequestInterceptor = {
    process(handlerInput) {
        console.log(`Incoming request: ${JSON.stringify(handlerInput.requestEnvelope.request)}`);
    }
};

const LoggingResponseInterceptor = {
    process(handlerInput, response) {
        console.log(`Outgoing response: ${JSON.stringify(response)}`);
    }
};

const LocalizationInterceptor = {
    process(handlerInput) {
        const localizationClient = i18n.use(sprintf).init({
            lng: handlerInput.requestEnvelope.request.locale,
            fallbackLng: 'en',
            overloadTranslationOptionHandler: sprintf.overloadTranslationOptionHandler,
            resources: languageStrings,
            returnObjects: true
        });

        const attributes = handlerInput.attributesManager.getRequestAttributes();
        attributes.t = function (...args) {
            return localizationClient.t(...args);
        }
    }
};

exports.handler = Alexa.SkillBuilders.custom()
    .addRequestHandlers(
        LaunchRequestHandler,
        ConvertIntentHandler,
        HelpIntentHandler,
        CancelAndStopIntentHandler,
        FallbackIntentHandler,
        SessionEndedRequestHandler,
        IntentReflectorHandler)
    .addErrorHandlers(ErrorHandler)
    .addRequestInterceptors(LocalizationInterceptor, LoggingRequestInterceptor)
    .addResponseInterceptors(LoggingResponseInterceptor)
    .withCustomUserAgent('sample/converter/v1.0')
    .lambda();
