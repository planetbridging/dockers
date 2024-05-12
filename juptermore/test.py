import tensorflow as tf

# Check TensorFlow version
print("TensorFlow version:", tf.__version__)

# Verify if TensorFlow can access the GPU
print("Is GPU available:", tf.config.list_physical_devices('GPU'))

# Simple computation to test TensorFlow
def compute_square(n):
    # Create a tensor
    tensor = tf.constant(n, dtype=tf.float32)
    # Compute the square
    squared_tensor = tf.square(tensor)
    return squared_tensor

# Test with a number
result = compute_square(5.0)
print("Square of 5 is:", result.numpy())

# Perform a more complex operation to utilize the GPU
def compute_matrix_multiplication(size):
    # Create two random matrices
    matrix1 = tf.random.uniform((size, size), minval=0, maxval=1)
    matrix2 = tf.random.uniform((size, size), minval=0, maxval=1)
    # Perform matrix multiplication
    product = tf.matmul(matrix1, matrix2)
    return product

# Test with a 1000x1000 matrix
large_result = compute_matrix_multiplication(1000)
print("Result of large matrix multiplication has shape:", large_result.shape)
