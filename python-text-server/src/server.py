'''
Rest service that exposes a single POST endpoint that accepts a JSON object 
with a  key, "prompt" and an optional key "model", and returns a JSON object with 
a single key, "tokens" # that has an array of the tokens returned by tiktoken.

Prompt is a string that needs to be tokenized. model is a string that is the name 
of a model in the  list of models returned by tiktoken.models(). If model is not
provided, use the default model "text-davinci-003". If the model is not found,
return an empty array. If the model is found, 
return the tokens returned by tiktoken.tokenize() for the prompt and model.

@Author: howdymic

'''


import json

from flask import Flask, request
from werkzeug.middleware.proxy_fix import ProxyFix

app = Flask(__name__)
# app.debug = True



app.wsgi_app = ProxyFix(
    app.wsgi_app, x_for=1, x_proto=1, x_host=1, x_prefix=1
)



@app.route("/text", methods=['POST', 'GET'])
def text():
    data = request.get_json()
    if not 'texts' in data:
      return json.dumps({'resp': 'не понял вопрос'})

    return json.dumps({'resp': ('ИИ говорит: '+data['texts'][0]) })



if __name__ == "__main__":
    app.run(host='0.0.0.0')