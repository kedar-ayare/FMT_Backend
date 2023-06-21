from collections import deque

def find_intermediate_users(graph, source_user, target_user):
    forward_queue = deque([(source_user, [])])
    backward_queue = deque([(target_user, [])])
    forward_visited = set([source_user])
    backward_visited = set([target_user])

    while forward_queue and backward_queue:
        print("Forward Queue:", forward_queue)
        print("Backward Queue:", backward_queue)
        print("Forward Visited:", forward_visited)
        print("Backward Visited:", backward_visited)

        forward_user, forward_path = forward_queue.popleft()
        backward_user, backward_path = backward_queue.popleft()

        # Check if the forward and backward searches meet
        if forward_user in backward_visited:
            path = forward_path + backward_path[::-1]
            print("Path Found:", path)
            return path

        # Explore forward neighbors
        for neighbor in graph[forward_user]:
            if neighbor not in forward_visited:
                forward_queue.append((neighbor, forward_path + [forward_user]))
                forward_visited.add(neighbor)

        # Explore backward neighbors
        for neighbor in graph[backward_user]:
            if neighbor not in backward_visited:
                backward_queue.append((neighbor, backward_path + [backward_user]))
                backward_visited.add(neighbor)

    # If no connection is found, return an empty list
    print("No Path Found")
    return []

# Example usage:
# Assuming 'graph' is a dictionary representing the graph structure

graph = {
    'A': ['B'],
    'B': ['C'],
    'C': ['D', 'E'],
    'D': [],
    'E': ['F'],
    'F': []
}

source_user = 'A'
target_user = 'C'

intermediate_users = find_intermediate_users(graph, source_user, target_user)

print(intermediate_users)
