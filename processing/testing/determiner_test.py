import unittest
from processing.determiner import Determiner
from processing.data import QueueItem


class DeterminerTest(unittest.TestCase):
    def setUp(self):
        self.determiner = Determiner(10)
        self.determiner.dogs = ['Samoyed', 'Eskimo_dog', 'Siberian_husky']


    def test_single_add(self):
        qitem = QueueItem(None, 1)
        qitem.predictions = {'Samoyed': 0.6473713, 'white_wolf': 0.3270528, 'Eskimo_dog': 0.017226903,
                             'Siberian_husky': 0.0022075095, 'Arctic_fox': 0.0016813669}
        self.determiner.add(qitem)

        results = {1: {'Samoyed': [0.6473713], 'Eskimo_dog': [0.017226903], 'Siberian_husky': [0.0022075095]}}

        self.assertEqual(self.determiner.predictions, results)

    def test_bulk_add(self):
        qitem = QueueItem(None, 2)
        for _ in range(10):
            qitem.predictions = {'Samoyed': 0.6473713, 'white_wolf': 0.3270528, 'Eskimo_dog': 0.017226903,
                                 'Siberian_husky': 0.0022075095, 'Arctic_fox': 0.0016813669}
            self.determiner.add(qitem)

        results = {2: {'Samoyed': [], 'Eskimo_dog': [], 'Siberian_husky': []}}
        for _ in range(10):
            results[2]['Samoyed'].append(0.6473713)
            results[2]['Eskimo_dog'].append(0.017226903)
            results[2]['Siberian_husky'].append(0.0022075095)

        self.assertEqual(self.determiner.predictions, results)

