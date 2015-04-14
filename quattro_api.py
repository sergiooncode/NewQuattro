import re
import random
import logging
import time

import endpoints
from protorpc import remote

from quattro_api_messages import BoardMessage

CLIENT_ID = '1085613355907-l2mqhscelo0edcar514ddl30k86srr8f.apps.googleusercontent.com'

@endpoints.api(name='quattro', version='v1',
               description='Quattro API',
               allowed_client_ids=[CLIENT_ID, endpoints.API_EXPLORER_CLIENT_ID])
class QuattroApi(remote.Service):
    
    @staticmethod
    def find_free_positions(board_state):
        col = 0
        row = 5
        valid_free_positions = []
        while col <= 6:
            while row >= 0:
                index = 7*row + col
                if board_state[index] == '-':
                    valid_free_positions.append(index)
                    break
                row -= 1
            row = 5
            col += 1
        return valid_free_positions
    
    @staticmethod
    def add_move_to_board(board_state):
        result = list(board_state)  # Need a mutable object
        free_indices = QuattroApi.find_free_positions(board_state)
        
        random_index = random.choice(free_indices)
        result[random_index] = 'O'
        time.sleep(0.4)
        return ''.join(result)

    @endpoints.method(BoardMessage, BoardMessage,
                      path='board', http_method='POST',
                      name='board.getmove')
    def board_get_move(self, request):     
        board_state = request.state
        if not (len(board_state) == 42 and set(board_state) <= set('OX-')):
            raise endpoints.BadRequestException('Invalid board.')
        return BoardMessage(state=self.add_move_to_board(board_state))
    
APPLICATION = endpoints.api_server([QuattroApi],
                                   restricted=False)