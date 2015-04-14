import quattro_api
import unittest

class TestQuattroApi(unittest.TestCase):
    def setUp(self):
        self.quattro_api = quattro_api.QuattroApi()
        
    @unittest.skip("testing skipping")
    def test_add_move_to_board(self):
        self.assertEqual(
            '-------' + 
            '-------' +
            '-------' +
            '-------' +
            '-------' +
            '------O',
            self.quattro_api.add_move_to_board('-------' + 
                                               '-------' +
                                               '-------' +
                                               '-------' +
                                               '-------' +
                                               '-------')
        )
    
    def test_find_free_positions_when_board_empty(self):
        self.assertEqual(
            [35, 36, 37, 38, 39, 40 ,41],
            self.quattro_api.find_free_positions('-------' + 
                                                 '-------' +
                                                 '-------' +
                                                 '-------' +
                                                 '-------' +
                                                 '-------')
        )
    
    
    def test_find_free_positions_when_first_row_complete(self):
        self.assertEqual(
            [28, 29, 30, 31, 32, 33, 34],
            self.quattro_api.find_free_positions('-------' + 
                                                 '-------' +
                                                 '-------' +
                                                 '-------' +
                                                 '-------' +
                                                 'XOXOXOX')
        )
    
    
    def test_find_free_positions_first_row_complete_plus_3_more_positions(self):
        self.assertEqual(
            [28, 29, 30, 24, 18, 33, 34],
            self.quattro_api.find_free_positions('-------' + 
                                                 '-------' +
                                                 '-------' +
                                                 '----X--' +
                                                 '---XO--' +
                                                 'XOXOXOX')
        )
    
    def test_find_free_positions_when_board_almost_full(self):
        self.assertEqual(
            [7, 17, 18, 12, 20],
            self.quattro_api.find_free_positions('-XO----' + 
                                                 '-XO----' +
                                                 'XOX--O-' +
                                                 'OOXOXXO' +
                                                 'OXOXOXO' +
                                                 'XOXOXOX')
        )
