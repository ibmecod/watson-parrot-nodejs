var express = require('express');
var router = express.Router();
var watson = require('watson-developer-cloud');

// cfenv provides access to your Cloud Foundry environment
// for more info, see: https://www.npmjs.com/package/cfenv
var cfenv = require('cfenv');

// get the app environment from Cloud Foundry
var appEnv = cfenv.getAppEnv();

// set up watson language translation if service is bound
var watsonLTConfig = appEnv.getService(/Language Translation.*/);
if (watsonLTConfig) {
  var language_translation = watson.language_translation({
    username: watsonLTConfig.credentials.username,
    password: watsonLTConfig.credentials.password,
    version: 'v2'
  });
}

// This API call takes some time so invoke before starting up the application
// TODO - A periodic call to this API would be a good idea to catch any changes
// in languages supported. Only run function if service is bound. For more info
// see http://www.ibm.com/smarterplanet/us/en/ibmwatson/developercloud/language-translation/api/v2/?node#identifiable_languages
if (language_translation) {
  function getLanguageNames() {
    language_translation.getIdentifiableLanguages(null,
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
	if(language_translation) {
    language_translation.identify({ text: req.body.input}, function(err, identifiedLanguages) {
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
