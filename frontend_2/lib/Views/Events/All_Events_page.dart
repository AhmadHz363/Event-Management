import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:frontend_2/Services/event_registration.dart';
import 'package:frontend_2/Utitlities/helper_classes/main_helper.dart';
import 'package:frontend_2/Views/Events/Add_Event_page.dart';
import 'package:intl/intl.dart';
import 'package:flutter_svg/flutter_svg.dart';
import 'package:flutter/cupertino.dart';

import '../../Features/Events/bloc/all_events_bloc.dart';
import '../../Features/Events/bloc/all_events_event.dart';
import '../../Features/Events/bloc/all_events_state.dart';
import '../../Models/EventModel.dart';
import '../../Models/UserModel.dart';

class AllEventsPage extends StatefulWidget {
  static const String route = '/allEvents';
  UserModel? currentUser;
  AllEventsPage({Key? key, this.currentUser}) : super(key: key);

  @override
  _AllEventsState createState() => _AllEventsState();
}

class _AllEventsState extends State<AllEventsPage> {
  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final screenWidth = MediaQuery.of(context).size.width;
    final isLargeScreen = screenWidth > 600;

    return BlocProvider(
      create: (_) => AllEventsBloc()..add(LoadAllEvents()),
      child: Scaffold(
        backgroundColor: theme.colorScheme.background,
        appBar: AppBar(
          title: const Text('Upcoming Events',
              style: TextStyle(fontWeight: FontWeight.w600)),
          centerTitle: true,
          elevation: 0,
          backgroundColor: Colors.transparent,
          foregroundColor: theme.colorScheme.onBackground,
          actions: [
            IconButton(
              icon: const Icon(Icons.search),
              onPressed: () => _showSearchDialog(context),
            ),
            if (isLargeScreen)
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 12),
                child: ElevatedButton.icon(
                  icon: const Icon(Icons.add, size: 18),
                  label: const Text('Create Event'),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: theme.colorScheme.primary,
                    foregroundColor: theme.colorScheme.onPrimary,
                  ),
                  onPressed: () => _navigateToCreateEvent(context),
                ),
              ),
          ],
        ),
        floatingActionButton: !isLargeScreen
            ? FloatingActionButton(
                backgroundColor: theme.colorScheme.primary,
                foregroundColor: theme.colorScheme.onPrimary,
                onPressed: () => _navigateToCreateEvent(context),
                child: const Icon(Icons.add),
              )
            : null,
        body: SafeArea(
          child: BlocBuilder<AllEventsBloc, AllEventsState>(
            builder: (context, state) {
              if (state is AllEventsLoading) {
                return const Center(child: AdaptiveProgressIndicator());
              } else if (state is AllEventsLoaded) {
                return _buildContent(context, state.events, isLargeScreen);
              } else if (state is AllEventsError) {
                return _buildErrorState(context, state);
              }
              return const SizedBox.shrink();
            },
          ),
        ),
      ),
    );
  }

  Widget _buildContent(
      BuildContext context, List<dynamic> events, bool isLargeScreen) {
    if (events.isEmpty) {
      return _buildEmptyState(context);
    }
    return RefreshIndicator.adaptive(
      onRefresh: () async => context.read<AllEventsBloc>().add(LoadAllEvents()),
      child: isLargeScreen
          ? GridView.builder(
              padding: const EdgeInsets.all(16),
              gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
                crossAxisCount: _calculateCrossAxisCount(context),
                crossAxisSpacing: 16,
                mainAxisSpacing: 16,
                childAspectRatio: 0.8,
              ),
              itemCount: events.length,
              itemBuilder: (context, index) =>
                  _buildEventCard(context, events[index]),
            )
          : ListView.separated(
              padding: const EdgeInsets.fromLTRB(16, 8, 16, 24),
              itemCount: events.length,
              separatorBuilder: (context, index) => const SizedBox(height: 16),
              itemBuilder: (context, index) =>
                  _buildEventCard(context, events[index]),
            ),
    );
  }

  Widget _buildEventCard(BuildContext context, dynamic event) {
    final startDate = event.get<DateTime>('startDate');
    final endDate = event.get<DateTime>('endDate');
    final image = event.get('image');
    final eventType = event.get<String>('eventType') ?? 'General';

    return FutureBuilder<bool>(
      future: EventRegistration.checkRegistered(event: event),
      builder: (context, snapshot) {
        final isRegistered = snapshot.data ?? false;

        return EventCard(
          imageUrl: image?['url'],
          title: event.get<String>('title') ?? 'No Title',
          description: event.get<String>('description'),
          startDate: startDate,
          endDate: endDate,
          location: event.get<String>('location'),
          participants: _getParticipantCount(event.get('maxParticipants')),
          eventType: eventType,
          onTap: () => _showRegisterDialog(
              context, event.get<String>('title') ?? 'Event', event),
          isRegistered: isRegistered,
        );
      },
    );
  }

  Widget _buildEmptyState(BuildContext context) {
    final theme = Theme.of(context);

    return Center(
      child: SingleChildScrollView(
        padding: const EdgeInsets.all(24),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            SvgPicture.asset(
              'assets/images/empty_events.svg',
              width: 200,
              color: theme.colorScheme.onSurface.withOpacity(0.5),
            ),
            const SizedBox(height: 24),
            Text(
              'No events scheduled yet',
              style: theme.textTheme.headlineSmall?.copyWith(
                color: theme.colorScheme.onSurface.withOpacity(0.8),
              ),
            ),
            const SizedBox(height: 8),
            Text(
              'Check back later or create a new event',
              style: theme.textTheme.bodyMedium?.copyWith(
                color: theme.colorScheme.onSurface.withOpacity(0.6),
              ),
            ),
            const SizedBox(height: 24),
            ElevatedButton(
              onPressed: () => _navigateToCreateEvent(context),
              child: const Text('Create Event'),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildErrorState(BuildContext context, AllEventsError state) {
    final theme = Theme.of(context);

    return Center(
      child: SingleChildScrollView(
        padding: const EdgeInsets.all(24),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            SvgPicture.asset(
              'assets/images/error_cloud.svg',
              width: 120,
              color: theme.colorScheme.error.withOpacity(0.7),
            ),
            const SizedBox(height: 24),
            Text(
              'Failed to load events',
              style: theme.textTheme.headlineSmall?.copyWith(
                color: theme.colorScheme.onSurface.withOpacity(0.8),
              ),
            ),
            const SizedBox(height: 8),
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 24),
              child: Text(
                state.error,
                textAlign: TextAlign.center,
                style: theme.textTheme.bodyMedium?.copyWith(
                  color: theme.colorScheme.onSurface.withOpacity(0.6),
                ),
              ),
            ),
            const SizedBox(height: 24),
            ElevatedButton(
              style: ElevatedButton.styleFrom(
                backgroundColor: theme.colorScheme.primary,
                foregroundColor: theme.colorScheme.onPrimary,
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(12),
                ),
                padding:
                    const EdgeInsets.symmetric(horizontal: 24, vertical: 12),
              ),
              onPressed: () =>
                  context.read<AllEventsBloc>().add(LoadAllEvents()),
              child: const Text('Try Again'),
            ),
          ],
        ),
      ),
    );
  }

  void _showRegisterDialog(
      BuildContext context, String eventTitle, EventModel event) {
    final theme = Theme.of(context);

    showDialog(
      context: context,
      barrierDismissible: false,
      builder: (context) {
        return Dialog(
          shape:
              RoundedRectangleBorder(borderRadius: BorderRadius.circular(24)),
          elevation: 0,
          backgroundColor: Colors.transparent,
          child: Container(
            padding: const EdgeInsets.all(24),
            decoration: BoxDecoration(
              color: theme.colorScheme.surface,
              borderRadius: BorderRadius.circular(24),
              boxShadow: [
                BoxShadow(
                  color: Colors.black.withOpacity(0.1),
                  blurRadius: 24,
                  spreadRadius: 2,
                ),
              ],
            ),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    Container(
                      padding: const EdgeInsets.all(12),
                      decoration: BoxDecoration(
                        color: theme.colorScheme.primary.withOpacity(0.1),
                        shape: BoxShape.circle,
                      ),
                      child: Icon(
                        Icons.event_available_rounded,
                        size: 28,
                        color: theme.colorScheme.primary,
                      ),
                    ),
                    const SizedBox(width: 16),
                    Expanded(
                      child: Text(
                        'Register for "$eventTitle"',
                        style: theme.textTheme.titleLarge?.copyWith(
                          fontWeight: FontWeight.w600,
                        ),
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 24),
                Text(
                  'You are about to register for this event. If you proceed, your registration will be confirmed immediately.',
                  style: theme.textTheme.bodyMedium?.copyWith(
                    color: theme.colorScheme.onSurface.withOpacity(0.7),
                  ),
                ),
                const SizedBox(height: 24),
                Row(
                  children: [
                    Expanded(
                      child: OutlinedButton(
                        onPressed: () => Navigator.of(context).pop(),
                        style: OutlinedButton.styleFrom(
                          padding: const EdgeInsets.symmetric(vertical: 16),
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(12),
                          ),
                          side: BorderSide(
                            color: theme.colorScheme.outline.withOpacity(0.3),
                          ),
                        ),
                        child: Text(
                          'Cancel',
                          style: TextStyle(color: theme.colorScheme.onSurface),
                        ),
                      ),
                    ),
                    const SizedBox(width: 16),
                    Expanded(
                      child: ElevatedButton(
                        onPressed: () async {
                          await EventRegistration.createRegistration(
                              event: event);
                          Navigator.of(context).pop();
                          _showSuccessSnackbar(context);
                        },
                        style: ElevatedButton.styleFrom(
                          backgroundColor: theme.colorScheme.primary,
                          padding: const EdgeInsets.symmetric(vertical: 16),
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(12),
                          ),
                          elevation: 0,
                        ),
                        child: Text(
                          'Confirm',
                          style: TextStyle(color: theme.colorScheme.onPrimary),
                        ),
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),
        );
      },
    );
  }

  void _showSuccessSnackbar(BuildContext context) {
    final theme = Theme.of(context);

    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        behavior: SnackBarBehavior.floating,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
        margin: const EdgeInsets.all(16),
        padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 16),
        content: Row(
          children: [
            Icon(Icons.check_circle, color: theme.colorScheme.onPrimary),
            const SizedBox(width: 12),
            Expanded(
              child: Text(
                'Registration successful!',
                style: TextStyle(color: theme.colorScheme.onPrimary),
              ),
            ),
          ],
        ),
        backgroundColor: theme.colorScheme.primary,
        duration: const Duration(seconds: 3),
      ),
    );
  }

  void _showSearchDialog(BuildContext context) {
    showDialog(
      context: context,
      builder: (context) {
        return Dialog(
          shape:
              RoundedRectangleBorder(borderRadius: BorderRadius.circular(24)),
          child: Padding(
            padding: const EdgeInsets.all(24),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                TextField(
                  autofocus: true,
                  decoration: InputDecoration(
                    hintText: 'Search events...',
                    prefixIcon: const Icon(Icons.search),
                    border: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(12),
                    ),
                  ),
                ),
                const SizedBox(height: 16),
                // TODO: Add search filters
              ],
            ),
          ),
        );
      },
    );
  }

  void _navigateToCreateEvent(BuildContext context) {
    MainHelper.goToNavigatorScreen(context, AddEventPage());
  }

  int _getParticipantCount(dynamic maxParticipants) {
    if (maxParticipants is Map) return maxParticipants['savedNumber'] ?? 0;
    if (maxParticipants is int) return maxParticipants;
    return 0;
  }

  int _calculateCrossAxisCount(BuildContext context) {
    final screenWidth = MediaQuery.of(context).size.width;
    if (screenWidth > 1200) return 3;
    if (screenWidth > 800) return 2;
    return 1;
  }
}

class EventCard extends StatelessWidget {
  final String? imageUrl;
  final String title;
  final String? description;
  final DateTime? startDate;
  final DateTime? endDate;
  final String? location;
  final int participants;
  final String eventType;
  final VoidCallback onTap;
  final bool isRegistered;

  const EventCard(
      {required this.imageUrl,
      required this.title,
      this.description,
      this.startDate,
      this.endDate,
      this.location,
      this.participants = 0,
      required this.eventType,
      required this.onTap,
      this.isRegistered = false});

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return InkWell(
      onTap: isRegistered ? null : onTap,
      borderRadius: BorderRadius.circular(16),
      child: Container(
        decoration: BoxDecoration(
          color: theme.colorScheme.surface,
          borderRadius: BorderRadius.circular(16),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withOpacity(0.05),
              blurRadius: 12,
              offset: const Offset(0, 4),
            ),
          ],
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            if (imageUrl != null) _buildImage(theme),
            Padding(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(title, style: theme.textTheme.titleMedium),
                  if (description != null) ...[
                    const SizedBox(height: 8),
                    Text(
                      description!,
                      style: theme.textTheme.bodyMedium?.copyWith(
                        color: theme.colorScheme.onSurface.withOpacity(0.7),
                      ),
                      maxLines: 2,
                      overflow: TextOverflow.ellipsis,
                    ),
                  ],
                  const SizedBox(height: 12),
                  if (startDate != null)
                    _InfoRow(
                      icon: Icons.calendar_month_outlined,
                      text: _formatEventDate(startDate!, endDate),
                    ),
                  if (location != null) ...[
                    const SizedBox(height: 8),
                    _InfoRow(
                      icon: Icons.location_on_outlined,
                      text: location!,
                    ),
                  ],
                  const SizedBox(height: 8),
                  _InfoRow(
                    icon: Icons.people_outline,
                    text:
                        '$participants ${participants == 1 ? 'participant' : 'participants'}',
                  ),
                  const SizedBox(height: 8),
                  Align(
                    alignment: Alignment.centerRight,
                    child: ElevatedButton.icon(
                      onPressed:
                          isRegistered ? null : onTap, // disable if registered
                      style: ElevatedButton.styleFrom(
                        backgroundColor: isRegistered
                            ? theme.disabledColor
                            : theme.colorScheme.primary,
                        foregroundColor: isRegistered
                            ? theme.colorScheme.onSurface.withOpacity(0.5)
                            : theme.colorScheme.onPrimary,
                        padding: const EdgeInsets.symmetric(
                            horizontal: 20, vertical: 12),
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(12),
                        ),
                      ),
                      icon: Icon(
                        isRegistered
                            ? Icons.check_circle_outline
                            : Icons.event_available_outlined,
                        size: 18,
                      ),
                      label: Text(isRegistered ? 'Registered' : 'Register'),
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

  Widget _buildImage(ThemeData theme) {
    return ClipRRect(
      borderRadius: const BorderRadius.vertical(top: Radius.circular(16)),
      child: Stack(
        children: [
          Image.network(
            imageUrl!,
            height: 160,
            width: double.infinity,
            fit: BoxFit.cover,
            loadingBuilder: (context, child, loadingProgress) {
              if (loadingProgress == null) return child;
              return Container(
                height: 160,
                color: theme.colorScheme.surfaceVariant.withOpacity(0.3),
                child: Center(
                  child: CircularProgressIndicator(
                    value: loadingProgress.expectedTotalBytes != null
                        ? loadingProgress.cumulativeBytesLoaded /
                            loadingProgress.expectedTotalBytes!
                        : null,
                    strokeWidth: 2,
                    color: theme.colorScheme.primary,
                  ),
                ),
              );
            },
            errorBuilder: (context, error, stackTrace) => Container(
              height: 160,
              color: theme.colorScheme.surfaceVariant.withOpacity(0.3),
              child: Center(
                child: Icon(
                  Icons.broken_image,
                  size: 40,
                  color: theme.colorScheme.onSurface.withOpacity(0.3),
                ),
              ),
            ),
          ),
          Positioned(
            top: 12,
            right: 12,
            child: Container(
              padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
              decoration: BoxDecoration(
                color: _getEventTypeColor(eventType),
                borderRadius: BorderRadius.circular(20),
              ),
              child: Text(
                eventType,
                style: const TextStyle(
                  color: Colors.white,
                  fontSize: 12,
                  fontWeight: FontWeight.w500,
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }

  String _formatEventDate(DateTime startDate, DateTime? endDate) {
    final dateFormat = DateFormat('MMM d, y');
    final timeFormat = DateFormat('h:mm a');

    if (endDate == null) {
      return '${dateFormat.format(startDate)} • ${timeFormat.format(startDate)}';
    }

    if (startDate.day == endDate.day) {
      return '${dateFormat.format(startDate)} • ${timeFormat.format(startDate)} - ${timeFormat.format(endDate)}';
    } else {
      return '${dateFormat.format(startDate)} - ${dateFormat.format(endDate)}';
    }
  }

  Color _getEventTypeColor(String type) {
    switch (type.toLowerCase()) {
      case 'workshop':
        return Colors.deepPurple;
      case 'conference':
        return Colors.orange;
      case 'meetup':
        return Colors.green;
      case 'social':
        return Colors.pink;
      default:
        return Colors.blueAccent;
    }
  }
}

class _InfoRow extends StatelessWidget {
  final IconData icon;
  final String text;

  const _InfoRow({required this.icon, required this.text});

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Icon(icon,
            size: 18, color: theme.colorScheme.onSurface.withOpacity(0.6)),
        const SizedBox(width: 8),
        Expanded(
          child: Text(
            text,
            style: theme.textTheme.bodyMedium?.copyWith(
              color: theme.colorScheme.onSurface.withOpacity(0.8),
            ),
          ),
        ),
      ],
    );
  }
}

class AdaptiveProgressIndicator extends StatelessWidget {
  const AdaptiveProgressIndicator({super.key});

  @override
  Widget build(BuildContext context) {
    final isCupertino = Theme.of(context).platform == TargetPlatform.iOS ||
        Theme.of(context).platform == TargetPlatform.macOS;

    return SizedBox(
      width: 60,
      height: 60,
      child: isCupertino
          ? const CupertinoActivityIndicator(radius: 14)
          : CircularProgressIndicator.adaptive(
              strokeWidth: 4,
              valueColor: AlwaysStoppedAnimation<Color>(
                  Theme.of(context).colorScheme.primary),
            ),
    );
  }
}
