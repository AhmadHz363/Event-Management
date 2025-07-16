import 'package:flutter/material.dart';
import 'package:frontend_2/Models/EventModel.dart';
import 'package:frontend_2/Services/event_services.dart';
import 'package:frontend_2/Utitlities/helper_classes/main_helper.dart';
import 'package:frontend_2/Views/Events/All_Events_page.dart';

import '../../Features/Login/login_page.dart';
import '../../Models/UserModel.dart';

class HomePage extends StatefulWidget {
  static const String route = '/home';
  UserModel? currentUser;
  HomePage({Key? key, this.currentUser}) : super(key: key);

  @override
  _HomePageState createState() => _HomePageState();
}

class _HomePageState extends State<HomePage> {
  int _currentIndex = 0;

  // Sample event data
  final List<Map<String, dynamic>> events = [
    {
      'title': 'Music Festival',
      'date': 'June 15, 2023',
      'location': 'Central Park',
      'image': 'assets/music_festival.jpg',
      'price': '\$45.00'
    },
    {
      'title': 'Tech Conference',
      'date': 'July 22, 2023',
      'location': 'Convention Center',
      'image': 'assets/tech_conference.jpg',
      'price': '\$120.00'
    },
    {
      'title': 'Art Exhibition',
      'date': 'August 5, 2023',
      'location': 'Modern Art Museum',
      'image': 'assets/art_exhibition.jpg',
      'price': 'Free'
    },
  ];

  @override
  void initState() {
    super.initState();
    _loadData(); // Call async method without await here
  }

  Future<void> _loadData() async {
    // your async code here, e.g. fetching data
    List<EventModel> list = await EventServices.getAllEvents();
    print("test $list");
  }

  Future<void> _logout() async {
    final user = await UserModel.getCurrentUser();
    if (user != null) {
      await user.logout();
      await MainHelper.clearUserFromPrefs();

      // Navigate to login or welcome page
      if (mounted) {
        MainHelper.goToNavigatorScreen(context, LoginPage());
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Event Finder'),
        actions: [
          IconButton(
            icon: const Icon(Icons.search),
            onPressed: () {
              // Search functionality
            },
          ),
          PopupMenuButton<String>(
            onSelected: (value) {
              if (value == 'logout') {
                _logout();
              }
            },
            itemBuilder: (BuildContext context) {
              return [
                PopupMenuItem<String>(
                  value: 'logout',
                  child: Row(
                    children: const [
                      Icon(Icons.logout, color: Colors.red),
                      SizedBox(width: 8),
                      Text('Logout'),
                    ],
                  ),
                ),
              ];
            },
          ),
        ],
      ),
      body: _buildBody(),
      bottomNavigationBar: BottomAppBar(
        shape: const CircularNotchedRectangle(),
        notchMargin: 6.0,
        child: Row(
          mainAxisAlignment: MainAxisAlignment.spaceAround,
          children: [
            IconButton(
              icon: Icon(Icons.home,
                  color: _currentIndex == 0 ? Colors.deepPurple : Colors.grey),
              onPressed: () {
                setState(() {
                  _currentIndex = 0;
                });
              },
            ),
            IconButton(
              icon: Icon(Icons.explore,
                  color: _currentIndex == 1 ? Colors.deepPurple : Colors.grey),
              onPressed: () {
                setState(() {
                  _currentIndex = 1;
                });
                MainHelper.goToNavigatorScreen(
                    context,
                    AllEventsPage(
                      currentUser: widget.currentUser,
                    ));
              },
            ),
            const SizedBox(width: 40), // Space for the FAB
            IconButton(
              icon: Icon(Icons.favorite,
                  color: _currentIndex == 2 ? Colors.deepPurple : Colors.grey),
              onPressed: () {
                setState(() {
                  _currentIndex = 2;
                });
              },
            ),
            IconButton(
              icon: Icon(Icons.person,
                  color: _currentIndex == 3 ? Colors.deepPurple : Colors.grey),
              onPressed: () {
                setState(() {
                  _currentIndex = 3;
                });
              },
            ),
          ],
        ),
      ),
      floatingActionButton: FloatingActionButton(
        child: Icon(Icons.add),
        onPressed: () {
          MainHelper.goToNavigatorScreen(
              context,
              AllEventsPage(
                currentUser: widget.currentUser,
              ));
        },
      ),
      floatingActionButtonLocation: FloatingActionButtonLocation.centerDocked,
    );
  }

  Widget _buildBody() {
    switch (_currentIndex) {
      case 0:
        return _buildHomeContent();
      case 1:
        return const Center(child: Text('Discover Events'));
      case 2:
        return const Center(child: Text('Saved Events'));
      case 3:
        return const Center(child: Text('Profile'));
      default:
        return _buildHomeContent();
    }
  }

  Widget _buildHomeContent() {
    return SingleChildScrollView(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Padding(
            padding: EdgeInsets.all(16.0),
            child: Text(
              'Upcoming Events',
              style: TextStyle(
                fontSize: 24,
                fontWeight: FontWeight.bold,
              ),
            ),
          ),
          _buildEventList(),
          const Padding(
            padding: EdgeInsets.all(16.0),
            child: Text(
              'Categories',
              style: TextStyle(
                fontSize: 24,
                fontWeight: FontWeight.bold,
              ),
            ),
          ),
          _buildCategoryGrid(),
        ],
      ),
    );
  }

  Widget _buildEventList() {
    return Container(
      height: 280,
      child: ListView.builder(
        scrollDirection: Axis.horizontal,
        itemCount: events.length,
        itemBuilder: (context, index) {
          return _buildEventCard(events[index]);
        },
      ),
    );
  }

  Widget _buildEventCard(Map<String, dynamic> event) {
    return Container(
      width: 220,
      margin: const EdgeInsets.symmetric(horizontal: 8.0, vertical: 8.0),
      child: Card(
        elevation: 4,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(12),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Expanded(
              child: ClipRRect(
                borderRadius:
                    const BorderRadius.vertical(top: Radius.circular(12)),
                child: Container(
                  color: Colors.grey[300],
                  child: Icon(Icons.event, size: 60, color: Colors.grey[600]),
                ),
              ),
            ),
            Padding(
              padding: const EdgeInsets.all(12.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    event['title'],
                    style: const TextStyle(
                      fontSize: 18,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  const SizedBox(height: 4),
                  Row(
                    children: [
                      const Icon(Icons.calendar_today,
                          size: 14, color: Colors.grey),
                      const SizedBox(width: 4),
                      Text(
                        event['date'],
                        style:
                            const TextStyle(fontSize: 12, color: Colors.grey),
                      ),
                    ],
                  ),
                  const SizedBox(height: 4),
                  Row(
                    children: [
                      const Icon(Icons.location_on,
                          size: 14, color: Colors.grey),
                      const SizedBox(width: 4),
                      Text(
                        event['location'],
                        style:
                            const TextStyle(fontSize: 12, color: Colors.grey),
                      ),
                    ],
                  ),
                  const SizedBox(height: 8),
                  Text(
                    event['price'],
                    style: const TextStyle(
                      fontSize: 16,
                      fontWeight: FontWeight.bold,
                      color: Colors.deepPurple,
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildCategoryGrid() {
    final categories = [
      {'name': 'Music', 'icon': Icons.music_note},
      {'name': 'Sports', 'icon': Icons.sports_soccer},
      {'name': 'Art', 'icon': Icons.palette},
      {'name': 'Food', 'icon': Icons.restaurant},
      {'name': 'Tech', 'icon': Icons.code},
      {'name': 'Business', 'icon': Icons.business},
    ];

    return GridView.builder(
      shrinkWrap: true,
      physics: const NeverScrollableScrollPhysics(),
      gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
        crossAxisCount: 3,
        childAspectRatio: 1.2,
      ),
      itemCount: categories.length,
      itemBuilder: (context, index) {
        return Card(
          margin: const EdgeInsets.all(8),
          elevation: 2,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(12),
          ),
          child: InkWell(
            borderRadius: BorderRadius.circular(12),
            onTap: () {
              // Navigate to category
            },
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Icon(categories[index]['icon'] as IconData,
                    size: 30, color: Colors.deepPurple),
                const SizedBox(height: 8),
                Text(categories[index]['name'] as String),
              ],
            ),
          ),
        );
      },
    );
  }
}
