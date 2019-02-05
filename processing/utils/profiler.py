import cProfile
from functools import wraps
from time import process_time


def profile(name):
    def inner(func):
        def wrapper(*args, **kwargs):
            prof = cProfile.Profile()
            retval = prof.runcall(func, *args, **kwargs)
            # Note use of name from outer scope
            prof.dump_stats(name)
            return retval
        return wrapper
    return inner


def process_timer(f):
    @wraps(f)
    def wrapper(*args, **kwargs):
        start = process_time()
        result = f(*args, **kwargs)
        end = process_time()
        print('Elapsed time: {}'.format(end-start))
        return result
    return wrapper


def async_process_timer(f):
    @wraps(f)
    async def wrapper(*args, **kwargs):
        start = process_time()
        result = await f(*args, **kwargs)
        end = process_time()
        print('Elapsed time: {}'.format(end-start))
        return result
    return wrapper
