import pprint

performance = []

with open('info.txt', 'r') as f:
    f.readline()
    for line in f:
        vals = line.split('\t')
        if float(vals[1]) > 0:
            performance.append((vals[0], pow(float(vals[1]) / 100, 1) / float(vals[3])))

sorted_performance = sorted(performance, reverse=True, key=lambda v: v[1])

pprint.pprint(sorted_performance)
