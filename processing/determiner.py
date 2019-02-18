from dogs import dogs
import os


FIRST_THRESHOLD = float(os.getenv('FIRST_THRESHOLD', 0.10))
ANY_THRESHOLD = float(os.getenv('ANY_THRESHOLD', 0.01))


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


def determine_predictions(list_predictions: [dict]):
    if len(list_predictions) == 0:
        return []

    payload = []
    combined = combine_dictionaries(list_predictions)
    predictions = average(combined)

    if len(predictions) > 0 and predictions[0][1] > FIRST_THRESHOLD:
        for prediction in predictions:
            if prediction[1] > ANY_THRESHOLD:
                payload.append(prediction)
            else:
                break

    return payload
