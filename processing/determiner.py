from dogs import dogs


def add(predictions: dict, new: dict):
    for prediction, value in new.items():
        if value in dogs:
            predictions.setdefault(prediction, []).append(value)


def average(predictions: dict):
    averages = []
    for prediction, values in predictions.items():
        averages.append((prediction, sum(values) / len(values)))
    return sorted(averages, reverse=True, key=lambda v: v[1])


def combine_dictionaries(list_predictions: [dict]):
    combined = {}
    for predictions in list_predictions:
        for prediction, value in predictions.items():
            if prediction in dogs:
                combined.setdefault(prediction, []).append(value)
    return combined

