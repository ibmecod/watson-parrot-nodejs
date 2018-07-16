var express = require('express');
var router = express.Router();
var LanguageTranslatorV3 = require('watson-developer-cloud/language-translator/v3');
var fs = require('fs');

// cfenv provides access to your Cloud Foundry environment
// for more info, see: https://www.npmjs.com/package/cfenv
var cfenv = require('cfenv');

// get the app environment from Cloud Foundry
var appEnv = cfenv.getAppEnv();

// set up watson language translation if service is bound use user/pass or iam_api_key as provided
var watsonLTConfig = appEnv.getService(/Language Translator.*/);
if (watsonLTConfig) {
  if (watsonLTConfig.credentials.username) {
    var language_translator = new LanguageTranslatorV3({
      username: watsonLTConfig.credentials.username,
      password: watsonLTConfig.credentials.password,
      url: watsonLTConfig.credentials.url,
      version:  '2018-05-01'
    });
  }
  else {
    var language_translator = new LanguageTranslatorV3({
      iam_apikey: watsonLTConfig.credentials.apikey,
      url: watsonLTConfig.credentials.url,
      version:  '2018-05-01'
    });
  }
}
else {
  if (fs.existsSync('/opt/lt-service-bind/binding')) {
    var binding = JSON.parse(fs.readFileSync('/opt/lt-service-bind/binding', 'utf8'));

    if (binding.username) {
      var language_translator = new LanguageTranslatorV3({
        username: binding.username,
        password: binding.password,
        url: binding.url,
        version: '2018-05-01'
      });
    }
    else {
      var language_translator = new LanguageTranslatorV3({
        iam_apikey: binding.apikey,
        url: binding.url,
        version: '2018-05-01'
      });
    }
  };
  // run empty constructor and get credentials from environment if available
  if (process.env.LANGUAGE_TRANSLATOR_APIKEY) { var language_translator = new LanguageTranslatorV3({
      iam_apikey: process.env.LANGUAGE_TRANSLATOR_APIKEY,
      version: '2018-05-01'
    });
  }
};

// This API call takes some time so invoke before starting up the application
// TODO - A periodic call to this API would be a good idea to catch any changes
// in languages supported. Only run function if service is bound.
if (language_translator) {
  function getLanguageNames() {
    language_translator.listIdentifiableLanguages(null,
    function(err, languages) {
      if (err)
        console.log(err)
      else
        identifiableLanguages = languages.languages
     });
  }
  getLanguageNames();
}

function getLanguageName(code) {
  if(identifiableLanguages) {
     for ( i = 0; i < identifiableLanguages.length; i++ ) {
       if ( code === identifiableLanguages[i].language) {
         return identifiableLanguages[i].name
       }
     }
    }
// if for some reason (e.g. race conditition) and we don't have a working list
// of languages to look up the name, just return the code.
    return code;
}

// if we have a watson language service defined, call it on the message input
// and then convert the returned code to the language name otherwise go to the next function
function detectLanguage(req, res, next) {
	if(language_translator) {
    language_translator.identify({ text: req.body.input}, function(err, identifiedLanguages) {
    if (err)
      console.log(err)
    else
      req.body.inputLanguage = getLanguageName(identifiedLanguages.languages[0].language)
      return next();
    });
	} else {
		return next();
	}
}


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { page: { title: 'Home',
                                 message:  ''    ,
                                 language: ''} });
});

/* POST home page. */
router.post('/', detectLanguage, function(req, res, next) {
  res.render('index', { page: { title: "Parrot - Reply",
                                     message: req.body.input,
                                     language: req.body.inputLanguage }});
});

module.exports = router;
