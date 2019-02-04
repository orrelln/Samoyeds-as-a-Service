from processing.data import QueueItem

dogs = ['Samoyed', 'Eskimo_dog', 'Siberian_husky']


class Determiner:
    def __init__(self, net_count: int):
        self.net_count = net_count
        self.predictions = {}
        self.dogs = dogs

    def add(self, result: QueueItem):
        for prediction, value in result.predictions.items():
            if prediction in self.dogs:
                self.predictions.setdefault(result.idx, {}).setdefault(prediction, []).append(value)


