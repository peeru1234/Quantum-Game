using UnityEngine;
using UnityEngine.InputSystem;
using QBreak.Interaction;
using QBreak.Quantum;

namespace QBreak.Player
{
    [RequireComponent(typeof(CharacterController))]
    public class FirstPersonPlayer : MonoBehaviour
    {
        [Header("Movement Settings")]
        [SerializeField] private float walkSpeed = 4.0f;
        [SerializeField] private float sprintSpeed = 6.5f;
        [SerializeField] private float jumpHeight = 1.2f;
        [SerializeField] private float gravity = -15.0f;

        [Header("Mouse Look Settings")]
        [SerializeField] private Transform cameraTransform;
        [SerializeField] private float mouseSensitivity = 0.15f;
        [SerializeField] private float minPitch = -85.0f;
        [SerializeField] private float maxPitch = 85.0f;

        [Header("Components")]
        [SerializeField] private PlayerInteraction interactionSystem;

        private CharacterController controller;
        private Vector2 moveInput;
        private Vector2 lookInput;
        private Vector3 velocity;
        private float pitch = 0f;
        private bool isSprinting = false;
        private bool isGrounded = false;
        private bool isPaused = false;

        private void Awake()
        {
            controller = GetComponent<CharacterController>();
            if (interactionSystem == null)
            {
                interactionSystem = GetComponent<PlayerInteraction>();
            }
        }

        private void Start()
        {
            LockCursor(true);
        }

        private void Update()
        {
            if (isPaused) return;

            HandleMouseLook();
            HandleMovement();
        }

        public void OnMove(InputValue value)
        {
            moveInput = value.Get<Vector2>();
        }

        public void OnLook(InputValue value)
        {
            lookInput = value.Get<Vector2>();
        }

        public void OnJump(InputValue value)
        {
            if (value.isPressed && isGrounded)
            {
                velocity.y = Mathf.Sqrt(jumpHeight * -2.0f * gravity);
            }
        }

        public void OnSprint(InputValue value)
        {
            isSprinting = value.isPressed;
        }

        public void OnInteract(InputValue value)
        {
            if (value.isPressed && !isPaused && interactionSystem != null)
            {
                interactionSystem.TriggerInteraction();
            }
        }

        public void OnBasisSwitch(InputValue value)
        {
            if (value.isPressed && !isPaused)
            {
                QuantumBasisManager.Instance?.ToggleBasis();
            }
        }

        public void OnPause(InputValue value)
        {
            if (value.isPressed)
            {
                TogglePause();
            }
        }

        private void HandleMovement()
        {
            isGrounded = controller.isGrounded;
            if (isGrounded && velocity.y < 0)
            {
                velocity.y = -2f;
            }

            float speed = isSprinting ? sprintSpeed : walkSpeed;
            Vector3 move = transform.right * moveInput.x + transform.forward * moveInput.y;
            controller.Move(move * speed * Time.deltaTime);

            velocity.y += gravity * Time.deltaTime;
            controller.Move(velocity * Time.deltaTime);
        }

        private void HandleMouseLook()
        {
            if (cameraTransform == null) return;

            float mouseX = lookInput.x * mouseSensitivity;
            float mouseY = lookInput.y * mouseSensitivity;

            pitch -= mouseY;
            pitch = Mathf.Clamp(pitch, minPitch, maxPitch);

            cameraTransform.localRotation = Quaternion.Euler(pitch, 0f, 0f);
            transform.Rotate(Vector3.up * mouseX);
        }

        public void LockCursor(bool locked)
        {
            Cursor.lockState = locked ? CursorLockMode.Locked : CursorLockMode.None;
            Cursor.visible = !locked;
        }

        public void TogglePause()
        {
            isPaused = !isPaused;
            LockCursor(!isPaused);
            Time.timeScale = isPaused ? 0f : 1f;
        }
    }
}
