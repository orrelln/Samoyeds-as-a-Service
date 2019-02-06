import pickle


def write(file, obj):
    with open('data/{}.pkl'.format(file), 'wb') as f:
        pickle.dump(obj, f, pickle.HIGHEST_PROTOCOL)


def read(file, default):
    try:
        with open('data/{}.pkl'.format(file), 'rb') as f:
            obj = pickle.load(f)
        return obj
    except (IOError, FileNotFoundError):
        return default

