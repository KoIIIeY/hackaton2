# -*- coding: utf-8 -*-
"""pipeline2.ipynb

Automatically generated by Colaboratory.

Original file is located at
    https://colab.research.google.com/drive/1cC2NRdpRkv_pQ7aDe7dC51hLOIecIatA
"""


import torch
from transformers import AutoTokenizer, AutoModel
import pandas as pd
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity
import warnings
import os

warnings.filterwarnings('ignore')

class ModelTokenizer:
    __tokenizer = AutoTokenizer.from_pretrained("cointegrated/rubert-tiny2")
    __model = AutoModel.from_pretrained("cointegrated/rubert-tiny2")
    # model.cuda()  # uncomment it if you have a GPU

    def get_embeddings(self, text):
        t = self.__tokenizer(text, padding=True, truncation=True, return_tensors='pt')
        with torch.no_grad():
            model_output = self.__model(**{k: v.to(self.__model.device) for k, v in t.items()})
        embeddings = model_output.last_hidden_state[:, 0, :]
        embeddings = torch.nn.functional.normalize(embeddings)
        return embeddings[0].cpu().numpy()

def read_data(path_to_file):
    data = pd.read_excel(path_to_file)
    data.columns = data.columns.str.lower()

    model = ModelTokenizer()

    data['неисправность_vec'] = data['неисправность'].apply(lambda x: model.get_embeddings(str(x).lower()))
    data['раздел_vec'] = data['раздел'].apply(lambda x: model.get_embeddings(str(x).lower()))

    return data

def str_emb_to_array_emb(str_emb):
    return np.array(eval(', '.join([num.strip() for num in str_emb.replace('\n', '').replace('[', '').replace(']', '').strip().split(' ') if len(num.strip())])), dtype='float32').reshape(1,-1)


def pattern_answers(list_answers):
    answer = 'Количество возможных причин: ' + str(len(list_answers)) + '.\n\n'
    if len(list_answers) > 1:
        for i in range(len(list_answers)):
            answer += list_answers[i][1].rstrip('.') + '. Возможное решение данной проблемы: ' + list_answers[i][2].rstrip('.') + ';\n\n'
        return answer.strip()[:-1] + '.'

    elif len(list_answers) == 1:
        answer += list_answers[0][1].rstrip('.') + '. Возможное решение данной проблемы: ' + list_answers[0][2].rstrip('.') + '.'
        return answer.strip()
    else:
        return answer.strip()

def get_answers(str_number, input_text, path_to_data):
    data = pd.read_csv(path_to_data)

    model = ModelTokenizer()

    data = data[data[str(str_number).lower()] == 1]


    data['similarity_неисправность'] = data['неисправность_vec'].apply(lambda x: cosine_similarity(model.get_embeddings(str(input_text).lower()).reshape(1,-1), str_emb_to_array_emb(x))[0][0])
    data['similarity_раздел'] = data['раздел_vec'].apply(lambda x: cosine_similarity(model.get_embeddings(str(input_text).lower()).reshape(1,-1), str_emb_to_array_emb(x))[0][0])

    data['total_similarity'] = data[['similarity_неисправность', 'similarity_раздел']].mean(axis=1)

    if data['total_similarity'].max() < 0.6:
        return pattern_answers([])
    else:
        return pattern_answers(data[data['total_similarity'] == data['total_similarity'].max()][['неисправность',	'вероятная причина',	'метод устранения']].values.tolist())


def main(text, train):

    a = os.path.basename(__file__)
    b = os.path.abspath(__file__).replace(a, '')

    answer = get_answers(train, text, b+'data.csv')

    return answer